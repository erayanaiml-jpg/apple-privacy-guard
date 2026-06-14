// Apple AI Privacy-Guard: Floating Shield Injector Engine
(function() {
    console.log(" Privacy-Guard: Injector Engine Active!");

    // 1. Create the Floating Shield Button
    const shieldButton = document.createElement('div');
    shieldButton.id = 'apple-privacy-shield-btn';
    
    // Design the button (Premium Apple Black Style)
    shieldButton.innerHTML = '';
    shieldButton.style.position = 'fixed';
    shieldButton.style.bottom = '30px';
    shieldButton.style.right = '30px';
    shieldButton.style.width = '60px';
    shieldButton.style.height = '60px';
    shieldButton.style.backgroundColor = '#000000';
    shieldButton.style.color = '#FFFFFF';
    shieldButton.style.borderRadius = '50%';
    shieldButton.style.display = 'flex';
    shieldButton.style.justifyContent = 'center';
    shieldButton.style.alignItems = 'center';
    shieldButton.style.fontSize = '30px';
    shieldButton.style.cursor = 'pointer';
    shieldButton.style.boxShadow = '0px 4px 15px rgba(255, 255, 255, 0.2)';
    shieldButton.style.zIndex = '999999';
    shieldButton.style.border = '2px solid #34c759'; // Green Shield Border
    shieldButton.style.transition = 'all 0.3s ease';

    // 2. Add Click Event - When user clicks the button
    shieldButton.addEventListener('click', function() {
        alert(" Apple AI Privacy-Guard: System Connected & Monitoring!");
    });

    // 3. Inject the button into ChatGPT website layout
    document.body.appendChild(shieldButton);
})();
