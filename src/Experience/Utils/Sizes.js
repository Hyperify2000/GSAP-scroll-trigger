class Sizes {
    static instance;

    constructor(targetElement=window) {
        if (Sizes.instance) return Sizes.instance;

        Sizes.instance = this;

        this.targetElement = targetElement;
        this.width = this.targetElement.offsetWidth;
        this.height = this.targetElement.offsetHeight;
    }

    Resize() {
        this.width = this.targetElement.offsetWidth;
        this.height = this.targetElement.offsetHeight;
    }
}

export default Sizes;