let tabID = null;


const main = () => {
    /**
     * thanks to Yong Wang for their answer on StackOverflow
     * https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
     */
    const waitForComponent = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    waitForComponent('div[role="main"]>div>div>div').then(elem => {
        const mainComponent = elem;

        if (mainComponent != null) {
            const storiesComponent = mainComponent.children[1];

            if (storiesComponent) storiesComponent.remove();
        }
    });
};

const isFacebookUrl = (url) => {
    const regex = /\.*.facebook.com\.*/;
    return regex.test(url);
};

const injectScript = (func=main) => chrome.scripting.executeScript({
    target: {
        tabId: tabID,
        allFrames: true
    },
    function: func,
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    tabID = tabId;

    if (isFacebookUrl(tab.url) && changeInfo.status === 'complete') {
        await injectScript(main);
    }
});
