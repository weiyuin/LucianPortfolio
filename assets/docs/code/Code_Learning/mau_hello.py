# FILE MẪU — dùng để kiểm tra khung xem code. Có thể xóa.

def chao(ten: str) -> str:
    """Trả về lời chào."""
    return f"Xin chào, {ten}!"


if __name__ == "__main__":
    for ten in ["Lucian", "Machine Vision", "机器视觉"]:
        print(chao(ten))
