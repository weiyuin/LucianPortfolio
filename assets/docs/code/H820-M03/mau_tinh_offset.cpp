// FILE MẪU — dùng để kiểm tra khung xem code. Có thể xóa.
#include <iostream>

struct Offset {
    double dx;
    double dy;
};

// Độ lệch giữa vị trí đo được và vị trí chuẩn (mm).
Offset tinhOffset(double xDo, double yDo, double xChuan, double yChuan) {
    return { xDo - xChuan, yDo - yChuan };
}

int main() {
    Offset o = tinhOffset(10.25, 5.10, 10.00, 5.00);
    std::cout << "dx = " << o.dx << ", dy = " << o.dy << std::endl;
    return 0;
}
