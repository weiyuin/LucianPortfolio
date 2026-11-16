// FILE MẪU — tên file có khoảng trắng để kiểm tra đường dẫn. Có thể xóa.
using System;

class MaTranXoay
{
    /// <summary>Xoay điểm (x, y) quanh gốc tọa độ một góc tính bằng độ.</summary>
    static (double X, double Y) Xoay(double x, double y, double gocDo)
    {
        double rad = gocDo * Math.PI / 180.0;
        double cos = Math.Cos(rad);
        double sin = Math.Sin(rad);
        return (x * cos - y * sin, x * sin + y * cos);
    }

    static void Main()
    {
        var p = Xoay(1.0, 0.0, 90.0);
        Console.WriteLine($"({p.X:F3}, {p.Y:F3})"); // (0.000, 1.000)
    }
}
