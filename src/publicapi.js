/*********************************************************
 * The actual jQuery plugin and document ready handlers.
 ********************************************************/

//The publicy exposed method of jQuery.prototype, available (and meant to be
//called) on jQuery-wrapped HTML DOM elements.
jQuery.fn.mathquill = function(cmd, latex) {
  switch (cmd) {
    case 'redraw':
    return this.each(function() {
      var blockId = $(this).attr(mqBlockId),
      rootBlock = blockId && MathElement[blockId];
      if (rootBlock) {
        (function postOrderRedraw(el) {
          el.eachChild(postOrderRedraw);
          if (el.redraw) el.redraw();
        }(rootBlock));
      }
    });
    case 'revert':
    return this.each(function() {
      var blockId = $(this).attr(mqBlockId),
      block = blockId && MathElement[blockId];
      if (block && block.revert)
        block.revert();
    });
    case 'latex':
    if (arguments.length > 1) {
      return this.each(function() {
        var blockId = $(this).attr(mqBlockId),
        block = blockId && MathElement[blockId];
        if (block)
          block.renderLatex(latex);
      });
    }

    var blockId = $(this).attr(mqBlockId),
    block = blockId && MathElement[blockId];
    return block && block.latex();
    case 'text':
    var blockId = $(this).attr(mqBlockId),
    block = blockId && MathElement[blockId];
    return block && block.text();
    case 'html':
    return this.html().replace(/ ?hasCursor|hasCursor /, '')
    .replace(/ class=(""|(?= |>))/g, '')
    .replace(/<span class="?cursor( blink)?"?><\/span>/i, '')
    .replace(/<span class="?textarea"?><textarea><\/textarea><\/span>/i, '');
    case 'write':
    if (arguments.length > 1)
      return this.each(function() {
        var blockId = $(this).attr(mqBlockId),
        block = blockId && MathElement[blockId],
        cursor = block && block.cursor;

        if (cursor)
          cursor.writeLatex(latex).parent.blur();
      });
    case 'cmd':
    if (arguments.length > 1)
      return this.each(function() {
        var blockId = $(this).attr(mqBlockId),
        block = blockId && MathElement[blockId],
        cursor = block && block.cursor;

        if (cursor) {
          var seln = cursor.prepareWrite();
          if (/^\\[a-z]+$/i.test(latex)) cursor.insertCmd(latex.slice(1), seln);
          else cursor.insertCh(latex, seln);
          cursor.hide().parent.blur();
        }
      });
    default:
    var textbox = cmd === 'textbox',
    editable = textbox || cmd === 'editable',
    RootBlock = textbox ? RootTextBlock : RootMathBlock;
    return this.each(function() {
      createRoot($(this), RootBlock(), textbox, editable);
    });
  }
};

/**
 * Sets the matrix size that will be output by the '\\matrix' command. {@code MatrixSize} is a
 * variable that points to the {@code LatexCmds.matrix->setSize} method (NOTE: There are a bunch
 * of closures in play which is why we can't simply call {@code LatexCmds.matrix.setSize(..)}).
 * The {@code MatrixSize} variable is defined in the {@code commands.js} file.
 *
 * Ensure to call this function BEFORE inserting a '\\matrix' command.
 *
 * The {@code MathQuill} object is defined in the intro.js file outside the anonymous function
 * declaration in order to make it visible publically.
 *
 * @param rows the number of rows in the matrix
 * @param cols the number of columns in the matrix
 */
MathQuill.setMatrixSize = function(rows, cols) {
  MatrixSize(rows, cols);
};

//on document ready, mathquill-ify all `<tag class="mathquill-*">latex</tag>`
//elements according to their CSS class.
jQuery(function() {
  jQuery('.mathquill-editable:not(.mathquill-rendered-math)').mathquill('editable');
  jQuery('.mathquill-textbox:not(.mathquill-rendered-math)').mathquill('textbox');
  jQuery('.mathquill-embedded-latex').mathquill();
});

