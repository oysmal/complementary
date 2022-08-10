import {C} from "./lib/Complementary";


const MyComponent = C<{name: string}>("my-test", ["name"])
    .render((renderer, props) => {
        renderer.h1({
            className: "container",
            children: `Hello ${props.name}`,
        })
    });

window.onload = () => {
    console.log("HEEEELO")
    const testElem = new MyComponent();
    testElem.setAttribute("name", "Øystein");
    document.body.append(testElem);
}


