/*
 * const comp = C<Props>("my-component", propNames?: string[])
 *   .render((host: HostElement, props: Props) => 
 *      host
 *       .h1({ children: props.title })
 *       .div({
 *         className: "mydiv",
 *         children: Elem.p({
 *            children: props.description
 *         })
 *       })
 *       .button({ textContent: props.btnName, onClick: e => console.log("hi") }));
 */


export type CElement = {
    tagName: string;
    className?: string;
    children?: CElement | CElement[] | string;
    onClick?: (event: Event) => void;
}

export type CElementNoTag = Omit<CElement, "tagName">;

export class RenderBuilder {
    private elements: CElement[] = [];

    public getElements() {
        return this.elements;
    }

    public h1 = (element: CElementNoTag) => { this.elements.push({ tagName: "h1", ...element}); return this; };
    public h2 = (element: CElementNoTag) => { this.elements.push({ tagName: "h2", ...element}); return this; };
    public h3 = (element: CElementNoTag) => { this.elements.push({ tagName: "h3", ...element}); return this; };
    public h4 = (element: CElementNoTag) => { this.elements.push({ tagName: "h4", ...element}); return this; };
    public h5 = (element: CElementNoTag) => { this.elements.push({ tagName: "h5", ...element}); return this; };
    public h6 = (element: CElementNoTag) => { this.elements.push({ tagName: "h6", ...element}); return this; };
    public p = (element: CElementNoTag) => { this.elements.push({ tagName: "p", ...element}); return this; };
    public a = (element: CElementNoTag) => { this.elements.push({ tagName: "a", ...element}); return this; };
    public button = (element: CElementNoTag) => { this.elements.push({ tagName: "button", ...element}); return this; };
    public div = (element: CElementNoTag) => { this.elements.push({ tagName: "div", ...element}); return this; };
}

function createElem(el: CElement) {
    const elem = document.createElement(el.tagName);
    if (el.className) elem.className = el.className;
    if (el.onClick) elem.addEventListener("click", el.onClick);

    if (typeof el.children === "string") {
        elem.textContent = el.children;
    } else if (Array.isArray(el.children)){
        renderElements(elem, el.children);
    } else if (el.children){
        renderElements(elem, [el.children])
    }

    return elem;
}

function renderElements(rootEl: HTMLElement, elements: CElement[]) {
    elements.forEach(el => {
        const elem = createElem(el);
        rootEl.append(elem);
    })
}

export function C<P>(name: string, propNames?: string[]) {
    const Component = class extends HTMLElement {
        
        private props: Record<string, any> = {};
        private elements: CElement[] = [];
        private static renderFn: undefined | ((renderer: RenderBuilder, props: P) => void);

        static get observedAttributes() {
            return propNames;
        }
        
        static render(fn: (renderer: RenderBuilder, props: P) => void) {
            Component.renderFn = fn;
            return this;
        }

        public doRender() {
            if (!Component.renderFn) {
                throw new Error("Render function for component is missing");
            }

            const host = new RenderBuilder();
            Component.renderFn(host, this.props as any);
            this.elements = host.getElements();
            return this.elements;
        }

        constructor() {
            super();
        }

        connectedCallback() {
            this.props = propNames?.reduce((acc, cur) => {
                acc[cur] = this.getAttribute(cur);
                return acc;
            }, {} as Record<string, any>) ?? {};


            const elements = this.doRender();
            renderElements(this, elements);
        }

    }

    window.customElements.define(name, Component);
    return Component;
}

