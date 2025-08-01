Advanced methods
ads via Carbon
Apart from all available methods you learnt from previous articles you can use some advanced ones. You can provide two additional methods: shortcut and clear.


Shortcut
You can provide a keyboard shortcut for your Inline Tool by shortcut getter. It should return string with keys combination. Available special keys you can see here. For Marker Tool we can use CTRL (or CMD) + M combination:

class MarkerTool {
    static get shortcut() {
        return 'CMD+M';
    }
}


Clear
Clear method is called when Inline Toolbar closes. You can use it to clean some properties or hide actions. Example for Marker Tool: 

class MarkerTool {
    clear() {
        this.hideActions();
    }
}

