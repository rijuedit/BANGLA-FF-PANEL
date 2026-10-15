// =========================================
// COPY PASSWORD FUNCTION
// =========================================
function copyPassword() {
  const passwordText = document.getElementById("panel-password").innerText;
  navigator.clipboard.writeText(passwordText).then(() => {
    const copyBtn = document.querySelector(".copy-btn");
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = "<i class='bx bx-check'></i> Copied!";
    copyBtn.style.color = "#34d399";
    copyBtn.style.borderColor = "#34d399";
    
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.style.color = "";
      copyBtn.style.borderColor = "";
    }, 2000);
  });
}
