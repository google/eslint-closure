/**
 * @fileoverview Externs for Code Mirror.
 * @externs
 */

const CM = {};

/** @record */ CM.Object = function() {};
/**
 *
 * @param {!HTMLTextAreaElement} textArea
 * @param {(!CM.DocOptions|undefined)} config
 * @return {!CM.Doc}
 */
CM.Object.prototype.fromTextArea = function(textArea, config) {};

/** @record */ CM.Doc = function() {};

/**
 * @param {!CM.Position} start
 * @param {!CM.Position} end
 * @param {!CM.MarkOptions=} options
 */
CM.Doc.prototype.markText = function(start, end, options) {};

/**
 * @param {!CM.Position} pos
 * @param {!CM.BookmarkOptions} options
 * @return {!CM.TextMarker}
 */
CM.Doc.prototype.setBookmark = function(pos, options) {};
/**
 * @param {!CM.Position} from
 * @param {!CM.Position} to
 * @return {!Array<CM.TextMarker>}
 */
CM.Doc.prototype.findMarks = function(from, to) {};
/**
 * @param {!CM.Position} pos
 * @return {!Array<CM.TextMarker>}
 */
CM.Doc.prototype.findMarksAt = function(pos) {};
/**
 * @return {!Array<CM.TextMarker>}
 */
CM.Doc.prototype.getAllMarks = function() {};
/**
 * @param {string} event
 * @param {function()} fn
 * @return {void}
 */
CM.Doc.prototype.on = function(event, fn) {};

/**
 * @param {string=} separator
 * @return {string}
 */
CM.Doc.prototype.getValue = function(separator) {};

/**
 * @param {number} n
 * @return {string}
 */
CM.Doc.prototype.getLine = function(n) {};

/** @record @extends {CM.Doc} */ CM.TextAreaDoc = function() {};
/** @type {function()} */ CM.TextAreaDoc.prototype.save;
/** @type {function()} */ CM.TextAreaDoc.prototype.toTextArea;
/**
 * @return {!HTMLTextAreaElement}
 */
CM.TextAreaDoc.prototype.getTextArea = function() {};


/** @record */ CM.TextMarker = function() {};
/** @return {void} */ CM.TexMarker.prototype.clear = function() {};
/** @return {void} */ CM.TexMarker.prototype.changed = function() {};
/** @return {{from: !CM.Position, to: !CM.Position}} */
CM.TexMarker.prototype.find = function() {};


/** @record */ CM.Position = function() {};
/** @type {number} */ CM.Position.prototype.line;
/** @type {number} */ CM.Position.prototype.ch;


/** @record */ CM.MarkOptions = function() {};
/** @type {(string|undefined)} */ CM.MarkOptions.prototype.className;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.inclusiveLeft;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.inclusiveRight;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.atomic;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.collapsed;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.clearOnEnter;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.clearWhenEmpty;
/** @type {(!Element|undefined)} */ CM.MarkOptions.prototype.replacedWith;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.handleMouseEvents;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.readOnly;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.addToHistory;
/** @type {(string|undefined)} */ CM.MarkOptions.prototype.startStyle;
/** @type {(string|undefined)} */ CM.MarkOptions.prototype.endStyle;
/** @type {(string|undefined)} */ CM.MarkOptions.prototype.css;
/** @type {(string|undefined)} */ CM.MarkOptions.prototype.title;
/** @type {(boolean|undefined)} */ CM.MarkOptions.prototype.shared;


/** @record */ CM.BookmarkOptions = function() {};
/** @type {(!Element|undefined)} */ CM.BookmarkOptions.prototype.widget;
/** @type {(boolean|undefined)} */ CM.BookmarkOptions.prototype.insertLeft;
/** @type {(boolean|undefined)} */ CM.BookmarkOptions.prototype.shared;
/** @type {(boolean|undefined)} */ CM.BookmarkOptions.prototype.handleMouseEvents;

/** @record */ CM.DocOptions = function() {};
/** @type {(string|CM.Doc|undefined)} */
CM.DocOptions.prototype.value;
/** @type {(string|!Object|undefined)} */
CM.DocOptions.prototype.mode;
/** @type {(?string|undefined)} */
CM.DocOptions.prototype.lineSeparator;
/** @type {(string|undefined)} */
CM.DocOptions.prototype.theme;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.indentUnit;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.smartIndent;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.tabSize;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.indentWithTabs;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.electricChars;
/** @type {(RegExp|undefined)} */
CM.DocOptions.prototype.specialChars;
/** @type {(function(string):!Element|undefined)} */
CM.DocOptions.prototype.specialCharPlaceholder;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.rtlMoveVisually;
/** @type {(string|undefined)} */
CM.DocOptions.prototype.keyMap;
/** @type {(!Object|undefined)} */
CM.DocOptions.prototype.extraKeys;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.lineWrapping;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.lineNumbers;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.firstLineNumber;
/** @type {(function(number):string|undefined)} */
CM.DocOptions.prototype.lineNumberFormatter;
/** @type {(!Array<string>|undefined)} */
CM.DocOptions.prototype.gutters;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.fixedGutter;
/** @type {(string|undefined)} */
CM.DocOptions.prototype.scrollbarStyle;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.coverGutterNextToScrollbar;
/** @type {(string|undefined)} */
CM.DocOptions.prototype.inputStyle;
/** @type {(boolean|string|undefined)} */
CM.DocOptions.prototype.readOnly;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.showCursorWhenSelecting;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.lineWiseCopyCut;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.undoDepth;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.historyEventDelay;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.tabindex;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.autofocus;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.dragDrop;
/** @type {(!Array<string>|undefined)} */
CM.DocOptions.prototype.allowDropFileTypes;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.cursorBlinkRate;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.cursorScrollMargin;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.cursorHeight;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.resetSelectionOnContextMenu;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.workTime;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.workDelay;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.pollInterval;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.flattenSpans;
/** @type {(boolean|undefined)} */
CM.DocOptions.prototype.addModeClass;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.maxHighlightLength;
/** @type {(number|undefined)} */
CM.DocOptions.prototype.viewportMargin;
