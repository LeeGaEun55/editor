Using API
ads via Carbon
Now it's time to use the Editor`s API features. We can access the API using the api object passed to the Tool constructor. For Marker Tool we need styles and selection APIs.

Styles API provides some CSS classes` names to stylize elements of our Tool with common Editor.js style:

class MarkerTool {

    constructor({api}) {
        this.api = api;
        this.button = null;
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = 'M';
        this.button.classList.add(this.api.styles.inlineToolButton);

        return this.button;
    }

}

Selection API has some useful methods to work with selected text fragments. For the Marker Tool we will use following API methods: findParentTag and expandToTag. First one accepts tag name and class name as arguments and returns first found parent element of anchorNode of the Selection with passed parameters and null if such element doesn't exist. Second one accepts HTML element as argument and expand current selection to that element.

After we replace selected text with mark element we need to expand selection to the inserted element:

surround(range) {
    if (this.state) {
        return;
    }

    const selectedText = range.extractContents();
    const mark = document.createElement('MARK');

    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
}

Let's move code of surrounding text to another method called wrap and create unwrap method to remove highlighting. To remove highlight we need to find mark tag from selection position and replace it with plain text:

surround(range) {
    if (this.state) {
        this.unwrap(range);
        return;
    }

    this.wrap(range);
}

wrap(range) {
    const selectedText = range.extractContents();
    const mark = document.createElement('MARK');

    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
}

unwrap(range) {
    const mark = this.api.selection.findParentTag('MARK');
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
}

Also we can modify checkState method using the API:

 checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;
  }

Now Tool works actually how it should but we can make it prettier. Let's add icon and change button state in accordance with current state of highlighting:

class MarkerTool {

    static get isInline() {
        return true;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;

        this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }

    constructor({api}) {
        this.api = api;
        this.button = null;
        this._state = false;
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
        this.button.classList.add(this.api.styles.inlineToolButton);

        return this.button;
    }
}

Last step is adding some styles for MARK element:

// marker.css
.cdx-marker {
  background: rgba(245,235,111,0.29);
  padding: 3px 0;
}

//marker.js
wrap(range) {
    const selectedText = range.extractContents();
    const mark = document.createElement('MARK');

    mark.classList.add('cdx-marker');
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
}

Congrats! Marker Tool is ready to use. Here is the full implementation:

// marker.css
.cdx-marker {
    background: rgba(245,235,111,0.29);
    padding: 3px 0;
}

// marker.js
class MarkerTool {

  static get isInline() {
    return true;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    this._state = state;

    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  constructor({api}) {
    this.api = api;
    this.button = null;
    this._state = false;

    this.tag = 'MARK';
    this.class = 'cdx-marker';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = '<svg width="20" height="18"><path d="M10.458 12.04l2.919 1.686-.781 1.417-.984-.03-.974 1.687H8.674l1.49-2.583-.508-.775.802-1.401zm.546-.952l3.624-6.327a1.597 1.597 0 0 1 2.182-.59 1.632 1.632 0 0 1 .615 2.201l-3.519 6.391-2.902-1.675zm-7.73 3.467h3.465a1.123 1.123 0 1 1 0 2.247H3.273a1.123 1.123 0 1 1 0-2.247z"/></svg>';
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range) {
    if (this.state) {
      this.unwrap(range);
      return;
    }

    this.wrap(range);
  }

  wrap(range) {
    const selectedText = range.extractContents();
    const mark = document.createElement(this.tag);

    mark.classList.add(this.class);
    mark.appendChild(selectedText);
    range.insertNode(mark);

    this.api.selection.expandToTag(mark);
  }

  unwrap(range) {
    const mark = this.api.selection.findParentTag(this.tag, this.class);
    const text = range.extractContents();

    mark.remove();

    range.insertNode(text);
  }


  checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;
  }
}

It's that simple! In the next article you can learn how to add some interactive elements for Inline Tools.