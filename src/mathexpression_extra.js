/**
 * *************************************************************************
 * *                               MathExpression                         **
 * *************************************************************************
 * @package     qtype                                                     **
 * @subpackage  mathexpression                                            **
 * @name        MathExpression                                            **
 * @copyright   oohoo.biz                                                 **
 * @link        http://oohoo.biz                                          **
 * @author      Nicolas Bretin (bretin@ualberta.ca)                       **
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later  **
 * *************************************************************************
 * ************************************************************************ */

var meCrossProduct = 
LatexCmds.meCrossProduct =
LatexCmds['meCrossProduct'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\meCrossProduct';
  _.htmlTemplate =
      '<span class="non-leaf">'
    +   '<span>&0</span>'
    +   '<span style="operator">&times;</span>'
    +   '<span>&1</span>'
    + '</span>'
  ;
  _.textTemplate = ['(', '*', ')'];
  _.finalizeTree = function() {
    this.up = this.ends[R].up = this.ends[L];
    this.down = this.ends[L].down = this.ends[R];
  };
});

var meDotProduct = 
LatexCmds.meDotProduct =
LatexCmds['meDotProduct'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\meDotProduct';
  _.htmlTemplate =
      '<span class="non-leaf">'
    +   '<span>&0</span>'
    +   '<span style="operator">&bullet;</span>'
    +   '<span>&1</span>'
    + '</span>'
  ;
  _.textTemplate = ['(', '*', ')'];
  _.finalizeTree = function() {
    this.up = this.ends[R].up = this.ends[L];
    this.down = this.ends[L].down = this.ends[R];
  };
});

var meScalarProduct = 
LatexCmds.meScalarProduct =
LatexCmds['meScalarProduct'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\meScalarProduct';
  _.htmlTemplate =
      '<span class="non-leaf">'
    +   '<span>&0</span>'
    +   '<span style="operator">&middot;</span>'
    +   '<span>&1</span>'
    + '</span>'
  ;
  _.textTemplate = ['(', '*', ')'];
  _.finalizeTree = function() {
    this.up = this.ends[R].up = this.ends[L];
    this.down = this.ends[L].down = this.ends[R];
  };
});

var mePower = 
LatexCmds.mePower =
LatexCmds['mePower'] = P(MathCommand, function(_, _super) {
  _.ctrlSeq = '\\mePower';
  _.htmlTemplate =
      '<span class="non-leaf">'
    +   '<span>&0</span>'
    +   '<sup class="non-leaf">'
    +    '<span>&1</span>'
    +   '</sup>'
    + '</span>'
  ;
  _.textTemplate = ['^'];
  _.finalizeTree = function() {
    this.up = this.ends[R].up = this.ends[L];
    this.down = this.ends[L].down = this.ends[R];
  };
});