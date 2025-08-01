Basics
ads via Carbon
First of all lets describe elements we will work with. Every Inline Tool must provide a button — HTML element with icon or some layout — for Inline Toolbar of the Editor. When button is pressed Inline Tool receives selected text range as JavaScript Range object references to TextNode on the page. Some Tools may also provide actions for additional interactions with the user.

Enough theory, lets do some practice! To start we need to define JavaScript class. To let Editor know that this Tool is inline we need to provide isInline static getter:

class MarkerTool {
    static get isInline() {
        return true;
    }
}

Inline Tools must provide three methods to work with Editor: render, surround, and checkState.

Render method must return HTML element of the button for Inline Toolbar. When user selects some text Editor calls checkState method of each Inline Tool with current Selection to update the state if selected text contains some of the inline markup. Finally, when button is pressed Editor calls surround method of the tool with Range object as an argument:

class MarkerTool {

    static get isInline {
        true;
    }

    render() {
        
    }

    surround(range) {
    
    } 

    checkState(selection) {
    
    }

}

Lets create the basic structure of the Tool and add primitive implementation for methods.

class MarkerTool {

    static get isInline() {
        return true;
    }

    constructor() {
        this.button = null;
        this.state = false;
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = 'M';

        return this.button;
    }

    surround(range) {
        if (this.state) {
            // If highlights is already applied, do nothing for now
            return;
        }

        const selectedText = range.extractContents();

        // Create MARK element
        const mark = document.createElement('MARK');

        // Append to the MARK element selected TextNode
        mark.appendChild(selectedText);

        // Insert new element
        range.insertNode(mark);
    }

   
    checkState(selection) {
        const text = selection.anchorNode;

        if (!text) {
            return;
        }

        const anchorElement = text instanceof Element ? text : text.parentElement;
      
        this.state = !!anchorElement.closest('MARK');
    }
}

For now if highlight is applied you can't redo it. How to deal with that you can read at Using API article.