const button = document.querySelector(".send-button");

button.addEventListener('click', async () => {
    try {
        button.innerHTML = 'Rephrasing..';
        button.disabled = true;
        const data = document.querySelector(".message-input").value;

        const response = await fetch('https://ezymail-production.up.railway.app/ezymail/mail/rephrase',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
                ,
                body: JSON.stringify({
                    content: data
                })
            });
        if (!response.ok) {
            throw new Error('API Request failed...');
        }
        const existingButton = document.querySelector('.rephrased-text');
        if (existingButton) {
            existingButton.remove();
        }
        const generatedReply = await response.text();

        // Create a new div
        const newDiv = document.createElement("li");
        newDiv.classList.add('rephrased-text');
        newDiv.textContent = generatedReply;
        // newDiv.style.marginTop = "20px";
        // newDiv.style.padding = "10px";
        // newDiv.style.border = "1px solid #ccc";
        // newDiv.style.borderRadius = "5px";
        // newDiv.style.backgroundColor = "#f9f9f9";
        // newDiv.style.position = "relative";
        newDiv.style.display = "inline-block";

        // Append div to the body
        const list = document.querySelector(".message-list");

        list.appendChild(newDiv);
    } catch (error) {
        console.error('Failed to generate reply');
    }
    finally {
        button.innerHTML = 'Rephrase';
        button.disabled = false;
    }
});
