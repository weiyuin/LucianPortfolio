// Function copy text vào clipboard
function copyText(text, label) {
    navigator.clipboard.writeText(text).then(function() {
        // Gọi Toast của Bootstrap để hiện thông báo
        const toastEl = document.getElementById('copyToast');
        const toastBody = toastEl.querySelector('.toast-body');
        
        toastBody.innerText = `Đã copy ${label}: ${text}`;
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }, function(err) {
        console.error('Không thể copy: ', err);
    });
}

// Log để kiểm tra file JS đã chạy
console.log("Lucian Portfolio Loaded Successfully");