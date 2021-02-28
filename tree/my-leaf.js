class MyLeaf extends HTMLElement {
    constructor(subTree = { id: new Number(), items: [] }) {
        super();
        this.id =
            subTree && (subTree.id || subTree.id === 0) ? subTree.id : null;
        this.items = (subTree && subTree.items) || [];

        this.render();
    }

    render() {
        this.shadow = this.attachShadow({ mode: "open" });

        this.style.paddingLeft = "1em";
        this.style.display = "block";

        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = `Узел с id: ${this.id}`;
        details.appendChild(summary);

        this.items.forEach((item) => {
            details.appendChild(new MyLeaf(item));
        });
        details.open = true;
        this.shadow.appendChild(details);
    }
}

customElements.define("my-leaf", MyLeaf);
