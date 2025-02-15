console.log("Yippe it worked");

function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = "AI Reply";
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Genearte AI Reply');
    return button;
}

function findComposeToolbar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for(const selector of selectors){
        const toolbar = document.querySelector(selector);
        console.log("check");
        if(toolbar){
            return toolbar;
        }
        
    }
    return null; 
}

function getEmailContent(){
    const selectors = [
        '.h7',
        '.3s.aiL',
        '.gmail_quote'
    ];
    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }
    }
    return '';
}

function injectButton(){
    const existingButton = document.querySelector('.ai-reply-button');
    if(existingButton){
        //existingButton.remove();
        return;
    }
    const toolbar = findComposeToolbar();
    if(!toolbar){
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found");
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click', async() =>{
        try{
            button.innerHTML = 'Generating.....';
            button.disabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('https://ezymail-production.up.railway.app/ezymail/mail/generate', {method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    content: emailContent,
                    tone: "professional"
                })
            });
            //console.log(response.text());
            if(!response.ok){
                throw new Error('API Request failed...');
            }

            const generatedReply = await response.text();
            console.log('fetched reply');
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if(composeBox){
                console.log('found');
                composeBox.focus();
                console.log('focussed');
                document.execCommand('insertText', false, generatedReply);
                console.log('written');
            }
            else{
                console.error('Compose box not found');
            }
        }
        catch(error){
            console.error('Failed to generate reply');
        }
        finally{
            button.innerHTML = 'AI Reply';
            button.disabled = false;
        }

    });
    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver(
    (mutations) => {
        for(const mutation of mutations){
            const addedNodes = Array.from(mutation.addedNodes);
            const hasComposeElements = addedNodes.some(node =>
                node.nodeType === Node.ELEMENT_NODE && 
                (node.matches('.aDh, .btC, [role="dialog:"]') || node.querySelector('.aDh, .btC, [role="dialog:"]'))
            );

            if(hasComposeElements){
                console.log("Compose window detected");
                setTimeout(injectButton, 500);
            }
        }
    }
);

observer.observe(document.body, {
    childList:true,
    subtree:true
})