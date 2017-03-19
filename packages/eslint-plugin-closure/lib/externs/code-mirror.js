/**
 * @fileoverview Externs for Code Mirror.
 * @externs
 */

const CodeMirrorJS = {};

/** @record */ CodeMirrorJS.Object = function() {};
/**
 *
 * @param {!HTMLTextAreaElement} textArea
 * @param {(!CodeMirrorJS.DocOptions|undefined)} config
 */
CodeMirrorJS.Object.prototype.fromTextArea = function(textArea, config) {};

/** @record */ CodeMirrorJS.Doc = function() {};

/**
 * @param {!CodeMirrorJS.Position} start
 * @param {!CodeMirrorJS.Position} end
 * @param {!CodeMirrorJS.MarkOptions=} options
 */
CodeMirrorJS.Doc.prototype.markText = function(start, end, options) {};

/**
 * @param {string=} separator
 */
CodeMirrorJS.Doc.prototype.getValue = function(separator) {};

/** @record @extends {CodeMirrorJS.Doc} */
CodeMirrorJS.TextAreaDoc = function() {};
CodeMirrorJS.TextAreaDoc.prototype.save = function() {};
CodeMirrorJS.TextAreaDoc.prototype.toTextArea = function() {};
/**
 * @return {!HTMLTextAreaElement}
 */
CodeMirrorJS.TextAreaDoc.prototype.getTextArea = function() {};


/** @record */ CodeMirrorJS.Position = function() {};
/** @type {number} */ CodeMirrorJS.Position.prototype.line;
/** @type {number} */ CodeMirrorJS.Position.prototype.ch;


/** @record */ CodeMirrorJS.MarkOptions = function() {};
/** @type {(string|undefined)} */ CodeMirrorJS.MarkOptions.prototype.className;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.inclusiveLeft;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.inclusiveRight;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.atomic;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.collapsed;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.clearOnEnter;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.clearWhenEmpty;
/** @type {(!Element|undefined)} */ CodeMirrorJS.MarkOptions.prototype.replacedWith;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.handleMouseEvents;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.readOnly;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.addToHistory;
/** @type {(string|undefined)} */ CodeMirrorJS.MarkOptions.prototype.startStyle;
/** @type {(string|undefined)} */ CodeMirrorJS.MarkOptions.prototype.endStyle;
/** @type {(string|undefined)} */ CodeMirrorJS.MarkOptions.prototype.css;
/** @type {(string|undefined)} */ CodeMirrorJS.MarkOptions.prototype.title;
/** @type {(boolean|undefined)} */ CodeMirrorJS.MarkOptions.prototype.shared;

/** @record */ CodeMirrorJS.DocOptions = function() {};
/** @type {(string|CodeMirrorJS.Doc|undefined)} */
CodeMirrorJS.DocOptions.prototype.value;
/** @type {(string|!Object|undefined)} */
CodeMirrorJS.DocOptions.prototype.mode;
/** @type {(?string|undefined)} */
CodeMirrorJS.DocOptions.prototype.lineSeparator;
/** @type {(string|undefined)} */
CodeMirrorJS.DocOptions.prototype.theme;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.indentUnit;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.smartIndent;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.tabSize;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.indentWithTabs;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.electricChars;
/** @type {(RegExp|undefined)} */
CodeMirrorJS.DocOptions.prototype.specialChars;
/** @type {(function(string):!Element|undefined)} */
CodeMirrorJS.DocOptions.prototype.specialCharPlaceholder;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.rtlMoveVisually;
/** @type {(string|undefined)} */
CodeMirrorJS.DocOptions.prototype.keyMap;
/** @type {(!Object|undefined)} */
CodeMirrorJS.DocOptions.prototype.extraKeys;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.lineWrapping;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.lineNumbers;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.firstLineNumber;
/** @type {(function(number):string|undefined)} */
CodeMirrorJS.DocOptions.prototype.lineNumberFormatter;
/** @type {(!Array<string>|undefined)} */
CodeMirrorJS.DocOptions.prototype.gutters;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.fixedGutter;
/** @type {(string|undefined)} */
CodeMirrorJS.DocOptions.prototype.scrollbarStyle;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.coverGutterNextToScrollbar;
/** @type {(string|undefined)} */
CodeMirrorJS.DocOptions.prototype.inputStyle;
/** @type {(boolean|string|undefined)} */
CodeMirrorJS.DocOptions.prototype.readOnly;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.showCursorWhenSelecting;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.lineWiseCopyCut;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.undoDepth;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.historyEventDelay;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.tabindex;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.autofocus;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.dragDrop;
/** @type {(!Array<string>|undefined)} */
CodeMirrorJS.DocOptions.prototype.allowDropFileTypes;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.cursorBlinkRate;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.cursorScrollMargin;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.cursorHeight;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.resetSelectionOnContextMenu;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.workTime;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.workDelay;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.pollInterval;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.flattenSpans;
/** @type {(boolean|undefined)} */
CodeMirrorJS.DocOptions.prototype.addModeClass;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.maxHighlightLength;
/** @type {(number|undefined)} */
CodeMirrorJS.DocOptions.prototype.viewportMargin;
