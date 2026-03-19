"""
Fraud Detection GNN — safe to import even without torch / torch-geometric.
Falls back to a heuristic scorer when PyTorch is unavailable.
"""

import networkx as nx


class _MockFraudDetector:
    """Pure-Python heuristic scorer used when torch is unavailable."""

    def score_wallet_graph(self, G: nx.Graph) -> dict[str, float]:
        import random
        node_list = list(G.nodes())
        if not node_list:
            return {}
        try:
            betweenness = nx.betweenness_centrality(G)
        except Exception:
            betweenness = {n: 0.0 for n in node_list}
        scores = {}
        for n in node_list:
            degree = G.degree(n)
            risk = min(1.0, degree * 0.04 + betweenness.get(n, 0) * 1.5 + random.uniform(0, 0.1))
            scores[n] = round(risk, 4)
        return scores


class _GNNFraudDetector:
    """PyTorch Geometric GCN-based detector."""

    def __init__(self):
        import torch
        from torch_geometric.nn import GCNConv

        class _FraudGCN(torch.nn.Module):
            def __init__(self, in_ch=8, hid=16):
                super().__init__()
                self.conv1 = GCNConv(in_ch, hid)
                self.conv2 = GCNConv(hid, 1)

            def forward(self, x, edge_index):
                x = self.conv1(x, edge_index).relu()
                return self.conv2(x, edge_index).squeeze(-1)

        self._torch = torch
        self.model = _FraudGCN()
        self.model.eval()

    def score_wallet_graph(self, G: nx.Graph) -> dict[str, float]:
        torch = self._torch
        node_list = list(G.nodes())
        if not node_list:
            return {}
        x = torch.ones((len(node_list), 8))
        edges = [(node_list.index(u), node_list.index(v)) for u, v in G.edges()]
        if not edges:
            return {n: 0.05 for n in node_list}
        edge_index = torch.tensor(edges, dtype=torch.long).t()
        with torch.no_grad():
            scores = self.model(x, edge_index).sigmoid().tolist()
        return {node_list[i]: float(scores[i]) for i in range(len(node_list))}


def _load_detector():
    try:
        return _GNNFraudDetector()
    except Exception:
        return _MockFraudDetector()


fraud_detector = _load_detector()
