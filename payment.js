/* ===== SUMMER SCHOOL 2026 - PAYMENT LOGIC ===== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. RE-INITIALIZE SUPABASE (Same credentials as script.js)
    const SUPABASE_URL = 'https://rgftzhzvzrcooajosqdd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZnR6aHp2enJjb29ham9zcWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMDQyMzIsImV4cCI6MjA4ODc4MDIzMn0.FA8DdUmtOTjtbShtEiLytITCgWy_5t9dtqlcEZbyPJA';
    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. GET SESSION DATA
    const pendingData = JSON.parse(sessionStorage.getItem('pendingRegistration'));

    const upiId = '229675178001671@cnrb';
    const payeeName = 'IEEE SB VJEC';
    const upiIdBackup = 'alanantony896@oksbi';
    const payeeNameBackup = 'Alan Antony';
    const txnNote = 'Summer School 2026 Registration';

    function getUpiUrl(amount, upi = upiId, name = payeeName) {
        const params = new URLSearchParams({
            pa: upi,
            pn: name,
            am: amount,
            tn: txnNote,
            cu: 'INR'
        });
        return `upi://pay?${params.toString()}`;
    }

    function updatePaymentUI(amount) {
        document.getElementById('payableAmount').textContent = `₹ ${amount.toLocaleString()}`;
        
        // Primary UPI Update
        const upiUrl = getUpiUrl(amount);
        const qrImg = document.querySelector('#paymentQR img');
        if (qrImg) {
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
        }
        document.getElementById('gpayLink').href = upiUrl;

        // Backup UPI Update
        const upiUrlBackup = getUpiUrl(amount, upiIdBackup, payeeNameBackup);
        const qrImgBackup = document.querySelector('#backupQR img');
        if (qrImgBackup) {
            qrImgBackup.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrlBackup)}`;
        }
        const gpayLinkSecondary = document.getElementById('gpayLinkSecondary');
        if (gpayLinkSecondary) {
            gpayLinkSecondary.href = upiUrlBackup;
        }
    }

    if (!pendingData) {
        console.warn('No pending registration found in session. Using dummy data for demo.');
        document.getElementById('userName').textContent = "Guest User";
        updatePaymentUI(2500);
    } else {
        document.getElementById('userName').textContent = pendingData.name;
        updatePaymentUI(pendingData.paymentamount);
    }

    // 3. HANDLE FILE INPUT UI
    const fileInput = document.getElementById('screenshot');
    const fileLabel = document.querySelector('.file-upload-design span');
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileLabel.textContent = e.target.files[0].name;
            fileLabel.style.color = 'var(--neon-blue)';
        }
    });

    // 4. COPY UPI ID FALLBACK
    const copyBtn = document.getElementById('copyUpiBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(upiId).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied ID!';
                setTimeout(() => copyBtn.textContent = originalText, 2000);
            });
        });
    }

    const copyBtnBackup = document.getElementById('copyUpiBtnSecondary');
    if (copyBtnBackup) {
        copyBtnBackup.addEventListener('click', () => {
            navigator.clipboard.writeText(upiIdBackup).then(() => {
                const originalText = copyBtnBackup.textContent;
                copyBtnBackup.textContent = '✓ Copied ID!';
                setTimeout(() => copyBtnBackup.textContent = originalText, 2000);
            });
        });
    }

    // 5. HANDLE FORM SUBMISSION
    const paymentForm = document.getElementById('paymentConfirmForm');
    const submitBtn = document.getElementById('submitPaymentBtn');

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const transactionId = document.getElementById('transactionId').value.trim();
        const screenshotFile = fileInput.files[0];

        if (!transactionId || transactionId.length < 8) {
            alert('Please enter a valid Transaction ID/UTR number (at least 8 characters).');
            return;
        }

        if (!screenshotFile) {
            alert('Please upload a screenshot of your payment.');
            return;
        }

        if (!pendingData) {
            alert('Error: Registration session not found. Please try registering again.');
            return;
        }

        try {
            submitBtn.textContent = 'Submitting Details...';
            submitBtn.disabled = true;

            // Step A: Upload Screenshot to Supabase Storage (if bucket 'screenshots' exists)
            // If it fails, we will still record the transaction ID in the table.
            let screenshotUrl = null;
            try {
                // Get file extension
                const ext = screenshotFile.name.split('.').pop();
                const fileName = `${Date.now()}_${pendingData.email.replace(/@/g, '_')}.${ext}`;
                
                const { data: uploadData, error: uploadError } = await supabaseClient
                    .storage
                    .from('payments') // MUST match exactly what's in Supabase
                    .upload(`${fileName}`, screenshotFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Storage Error:', uploadError);
                    alert('Screenshot upload failed: ' + uploadError.message + '. We will still save your Transaction ID.');
                } else {
                    const { data: urlData } = supabaseClient.storage.from('payments').getPublicUrl(fileName);
                    screenshotUrl = urlData.publicUrl;
                    console.log('Upload Success, URL:', screenshotUrl);
                }
            } catch (storageErr) {
                console.error('General Storage Error:', storageErr);
            }

            // Step B: Final Submission - INSERT FULL DATA
            const finalParticipantData = {
                ...pendingData,
                paymentstatus: true,
                transactionid: transactionId,
                screenshoturl: screenshotUrl,
                createdat: new Date().toISOString()
            };

            const { error: insertError } = await supabaseClient
                .from('participants')
                .insert([finalParticipantData]);

            if (insertError) {
                if (insertError.code === '23505') throw new Error('You have already registered with this email.');
                throw insertError;
            }

            // Success!
            submitBtn.textContent = '✓ Registration Complete';
            submitBtn.style.background = 'linear-gradient(135deg, #22d3ee, #10b981)';

            alert('Registration successful! \n\nOur team will verify your payment and send the confirmation within 24 hours. See you at Summer School 2026!');
            
            sessionStorage.removeItem('pendingRegistration');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            alert('Submission failed: ' + error.message);
            submitBtn.textContent = 'Submit Payment Details';
            submitBtn.disabled = false;
        }
    });
});
