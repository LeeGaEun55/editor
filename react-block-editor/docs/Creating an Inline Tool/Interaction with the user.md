Interaction with the user
ads via Carbon
Our Marker Tool is ready to use. However, we can add some more features. For example, you want to choose a highlight color when you use Marker. For that we will use HTML input element with type color.  To add input to the Inline Toolbar we need renderActions method which returns some layout we want to add:

renderActions() {
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    this.colorPicker.value = '#f5f1cc';
    this.colorPicker.hidden = true;

    return this.colorPicker;
}

Now when marker button is pressed just show this input. When highlight is removed — hide it:

showActions(mark) {
    this.colorPicker.value = mark.style.backgroundColor || '#f5f1cc';

    this.colorPicker.onchange = () => {
        mark.style.backgroundColor = this.colorPicker.value;
    };
    this.colorPicker.hidden = false;
}

hideActions() {
    this.colorPicker.onchange = null;
    this.colorPicker.hidden = true;
}

checkState() {
    const mark = this.api.selection.findParentTag(this.tag);

    this.state = !!mark;

    if (this.state) {
        this.showActions(mark);
    } else {
        this.hideActions();
    }
}

Unfortunately that wouldn't work as expected because mark.style.backgroundColor returns the value of color in normalized rgb() format. To handle it we need one more helping method to convert the rgb value to hex:

showActions(mark) {
    const {backgroundColor} = mark.style;

    this.colorPicker.value = backgroundColor ? this.convertToHex(backgroundColor) : '#f5f1cc';

    this.colorPicker.onchange = () => {
        mark.style.backgroundColor = this.colorPicker.value;
    };
    this.colorPicker.hidden = false;
}

convertToHex(color) {
    const rgb = color.match(/(\d+)/g);
    
    let hexr = parseInt(rgb[0]).toString(16);
    let hexg = parseInt(rgb[1]).toString(16);
    let hexb = parseInt(rgb[2]).toString(16);
    
    hexr = hexr.length === 1 ? '0' + hexr : hexr;
    hexg = hexg.length === 1 ? '0' + hexg : hexg;
    hexb = hexb.length === 1 ? '0' + hexb : hexb;
    
    return '#' + hexr + hexg + hexb;
}

That's it! Now you can choose the color of marker. With renderActions method you can insert into Inline Toolbar any inputs or hints for the user (e.g. input for the link).

Here the full code of Marker Tool with color picker:

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
  
    if (this.state) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }

  renderActions() {
    this.colorPicker = document.createElement('input');
    this.colorPicker.type = 'color';
    this.colorPicker.value = '#f5f1cc';
    this.colorPicker.hidden = true;

    return this.colorPicker;
  }

  showActions(mark) {
    const {backgroundColor} = mark.style;
    this.colorPicker.value = backgroundColor ? this.convertToHex(backgroundColor) : '#f5f1cc';

    this.colorPicker.onchange = () => {
      mark.style.backgroundColor = this.colorPicker.value;
    };
    this.colorPicker.hidden = false;
  }

  hideActions() {
    this.colorPicker.onchange = null;
    this.colorPicker.hidden = true;
  }

  convertToHex(color) {
    const rgb = color.match(/(\d+)/g);

    let hexr = parseInt(rgb[0]).toString(16);
    let hexg = parseInt(rgb[1]).toString(16);
    let hexb = parseInt(rgb[2]).toString(16);

    hexr = hexr.length === 1 ? '0' + hexr : hexr;
    hexg = hexg.length === 1 ? '0' + hexg : hexg;
    hexb = hexb.length === 1 ? '0' + hexb : hexb;

    return '#' + hexr + hexg + hexb;
  }
}

In the next article you can learn about some advanced methods for Inline Tools.