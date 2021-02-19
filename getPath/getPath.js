function getPath(el) {
    if (!isCorrectElement(el)) {
        return null;
    }
    return getSelector(el);

    function isCorrectElement(node) {
        return (
            node &&
            node.nodeType === Node.ELEMENT_NODE &&
            ((node.parentNode === null && node.tagName === "HTML") ||
                node.parentNode !== null)
        );
    }

    function getSelector(el) {
        const tagName = el.tagName.toUpperCase();
        const id = uniqueId(el);
        if (id) {
            return id;
        }
        if (tagName === "BODY") {
            return tagName;
        }
        let selector = tagName;
        const searchResult =
            el.parentElement && el.parentElement.querySelectorAll(selector);

        if (searchResult && searchResult.length > 1) {
            selector += `:nth-child(${getNodeIndex(el) + 1})`;
        }
        if (el.parentElement) {
            return getSelector(el.parentElement) + " > " + selector;
        } else {
            return selector;
        }
    }

    function getNodeIndex(el) {
        const children = el.parentElement.children;
        for (let i = 0, len = children.length; i < len; ++i) {
            if (children[i] === el) {
                return i;
            }
        }
        return -1;
    }

    function uniqueId(el) {
        let id = el.id;
        if (id) {
            id = id.replace(/([^0-9A-Z-_])/gi, "\\$1");
            id = id.replace(/^\d/, (firstNum) => {
                return "\\" + ("" + firstNum).charCodeAt().toString(16);
            });
            const findEls = document.querySelectorAll("#" + id) || [];
            if (findEls.length === 1) {
                return "#" + id;
            }
        }
        return null;
    }
}
module.exports = getPath;
