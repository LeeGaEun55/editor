Sanitizing
ads via Carbon
Editor.js sanitizes all content in several cases: on render, on paste, and on save. Each Block Tool provides sanitizer rules to let Editor know which HTML tags it should respect. However, Block Tools are not connected with Inline ones so markup added by Inline Tool will be removed on pasting or on saving. To avoid that you need to provide sanitizer rules for your Inline Tool in sanitize static getter.

You can read more about sanitizer rules in Sanitizer API section. Here is the example for Marker Tool we created earlier:

class MarkerTool {
    static get sanitize() {
        return {
            mark: {
                class: 'cdx-marker'
            }
        };
    }
}

That means Editor will respect all MARK elements with cdx-marker class and your highlights won't be lost.