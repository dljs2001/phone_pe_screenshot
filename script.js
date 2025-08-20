document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('receiptCanvas');
    const ctx = canvas.getContext('2d');

    // Set the high-resolution canvas dimensions
    const CANVAS_WIDTH = 720;
    const CANVAS_HEIGHT = 1600;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Form input elements
    const formTopLeftTime = document.getElementById('formTopLeftTime');
    const formStatusText = document.getElementById('formStatusText'); // <-- Reference to the new input
    const formTransactionTime = document.getElementById('formTransactionTime');
    const formDate = document.getElementById('formDate');
    const formName = document.getElementById('formName');
    const formUpiId = document.getElementById('formUpiId');
    const formAmount = document.getElementById('formAmount');
    const downloadBtn = document.getElementById('downloadBtn');

    // Load the background image
    const bgImage = new Image();
    bgImage.src = 'bg.png';
    bgImage.onload = () => {
        render();
    };

    function initializeDateTime() {
        const now = new Date();
        const topLeftTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        formTopLeftTime.value = topLeftTimeStr;

        const transactionDateTime = new Date(now.getTime() - 2 * 60000);
        formTransactionTime.value = transactionDateTime.toTimeString().slice(0, 5);
        formDate.valueAsDate = transactionDateTime;
    }

    function render() {
        // Amount placement variables
        const transactionAmountX = CANVAS_WIDTH - 35;
        const transactionAmountY = 290;
        const debitedAmountX = CANVAS_WIDTH - 35;
        const debitedAmountY = 750;

        // Clear canvas and draw background
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Get values from form
        const topLeftTime = formTopLeftTime.value;
        const statusText = formStatusText.value || 'Transaction is In Process'; // <-- Get status text from form
        const name = formName.value || 'Jeevan Jogi';
        const upiId = formUpiId.value || '9483800687';
        const amount = parseFloat(formAmount.value) || 6500;
        const formattedAmount = `₹ ${amount.toLocaleString('en-IN')}`;

        // Get and format transaction date/time
        let transactionTimeDateText = '';
        const time = formTransactionTime.value;
        const date = new Date(formDate.value);
        if (time && !isNaN(date)) {
            const [hours, minutes] = time.split(':');
            date.setHours(hours, minutes);
            const displayTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const displayDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            transactionTimeDateText = `${displayTime} on ${displayDate}`;
        }

        // --- Draw all text elements onto the canvas ---
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'top';

        // Top Left Time
        ctx.font = '600 28px -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(topLeftTime, 18, 15);

        // Status Text (now uses the variable from the form)
        ctx.font = 'bold 28px -apple-system, sans-serif';
        ctx.fillText(statusText, 118, 78);

        // Transaction Time & Date
        ctx.font = '700 20px -apple-system, sans-serif';
        ctx.fillStyle = '#f0f0f0';
        ctx.fillText(transactionTimeDateText, 118, 110);
        ctx.fillStyle = 'white';

        // Recipient Name
        ctx.font = '500 26px -apple-system, sans-serif';
        ctx.fillText(name, 140, 290);
        
        // Banking Name
        ctx.font = '24px -apple-system, sans-serif';
        ctx.fillText(name, 260, 430);

        // Recipient UPI
        ctx.font = '26px -apple-system, sans-serif';
        ctx.fillStyle = '#c7c7c7';
        ctx.fillText(upiId, 140, 320);
        ctx.fillStyle = 'white';
        
        // Right-aligned amounts
        ctx.textAlign = 'right';
        ctx.font = 'bold 26px -apple-system, sans-serif';
        
        // Transaction Amount
        ctx.fillText(formattedAmount, transactionAmountX, transactionAmountY);
        
        // Debited Amount
        ctx.fillText(formattedAmount, debitedAmountX, debitedAmountY);
    }
    
    // --- Event Listeners ---
    const allInputs = document.querySelectorAll('#detailsForm input');
    allInputs.forEach(input => {
        input.addEventListener('input', render);
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'transaction-receipt.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // --- Initial Setup ---
    initializeDateTime();

});
