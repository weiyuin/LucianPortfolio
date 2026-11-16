# FILE MẪU — không phải script thật của máy H510. Có thể xóa.
# 示例文件：像素坐标 → 机械坐标（仿射变换）
# Ví dụ: đổi tọa độ pixel sang tọa độ máy bằng phép biến đổi affine.

def pixel_to_machine(px, py, matrix):
    """matrix = [[a, b, tx], [c, d, ty]] — 标定得到的仿射矩阵."""
    (a, b, tx), (c, d, ty) = matrix
    x = a * px + b * py + tx
    y = c * px + d * py + ty
    return x, y


if __name__ == "__main__":
    # Ma trận ví dụ: tỉ lệ 0.01 mm/pixel, dịch (100, 50) mm
    demo_matrix = [[0.01, 0.0, 100.0], [0.0, 0.01, 50.0]]
    print(pixel_to_machine(1024, 768, demo_matrix))  # 坐标转换结果
