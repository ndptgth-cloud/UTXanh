const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const qrDialog = document.querySelector("#qr-dialog");
const openQrButton = document.querySelector("#open-qr-dialog");
const closeQrButton = document.querySelector("#close-qr-dialog");
const qrStatus = document.querySelector("#qr-status");
const qrCodeContainer = document.querySelector("#qr-code");
const qrPageUrl = document.querySelector("#qr-page-url");
const copyPageUrlButton = document.querySelector("#copy-page-url");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Mở menu");
  }
});


function loadQrGenerator() {
  if (window.QRCode) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const generatorScript = document.createElement("script");
    generatorScript.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    generatorScript.onload = () => resolve();
    generatorScript.onerror = () => reject(new Error("Không tải được thư viện tạo mã QR."));
    document.head.append(generatorScript);
  });
}

openQrButton.addEventListener("click", async () => {
  qrDialog.showModal();
  const url = document.querySelector('link[rel="canonical"]').href;
  qrPageUrl.value = url;
  qrCodeContainer.replaceChildren();
  qrStatus.textContent = "Đang tạo mã QR...";

  try {
    await loadQrGenerator();
    new window.QRCode(qrCodeContainer, {
      text: url,
      width: 208,
      height: 208,
      colorDark: "#0f172a",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M
    });
    qrStatus.textContent = "Mở camera điện thoại và quét mã để truy cập website UTxanh.";
  } catch (error) {
    console.error("Không thể tạo mã QR:", error);
    qrStatus.textContent = "Không tạo được mã QR. Hãy dùng nút sao chép liên kết.";
  }
});

closeQrButton.addEventListener("click", () => qrDialog.close());

qrDialog.addEventListener("click", (event) => {
  if (event.target === qrDialog) qrDialog.close();
});

copyPageUrlButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(qrPageUrl.value);
    qrStatus.textContent = "Đã sao chép địa chỉ website.";
  } catch {
    qrPageUrl.focus();
    qrPageUrl.select();
    qrStatus.textContent = "Không thể sao chép tự động. Địa chỉ đã được chọn — hãy sao chép thủ công.";
  }
});
