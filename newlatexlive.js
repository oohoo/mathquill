/**
 *
 * usage:
 * $(thing).latexlive();
 * turns thing into a live editable thingy.
 * AMAZORZ.
 */

jQuery.fn.latexlive = (function() { 
  /**
   * mathElement is the main LaTeXDOM prototype.
   * It prototypes both Blocks and Operators.
   */
  mathElement = { 
    prev: null,
    next: null,
    parent: null,
    jQ: (function() // closure around the actual jQuery object
    {
        var actual;
        return function(el)
        {
          if(arguments.length) // not if(el), which would fail on .jQ(undefined)
            return actual = jQuery(el);

          if(actual)
            return actual;

          return actual = jQuery(this.html ? this.html() : null).data('latexlive', this);
        };
    }()),
    prependTo: function(el)
    {
        if(this.parent)
            this.detach();
        
        this.parent = el;
        this.next = el.firstChild;
        this.prev = null;
        if(el.firstChild)
            el.firstChild.prev = this;
        else
            el.lastChild = this;
        el.firstChild = this;

        this.jQ().prependTo(el.jQ());
        
        return this;
    },
    appendTo:function(el)
    {
        if(this.parent)
            this.detach();
        
        this.parent = el;
        this.prev = el.lastChild;
        this.next = null;
        if(el.lastChild)
            el.lastChild.next = this;
        else
            el.firstChild = this;
        el.lastChild = this;

        this.jQ().appendTo(el.jQ());
        
        return this;
    },
    insertBefore: function(el)
    {
        if(this.parent)
            this.detach();
        
        this.parent = el.parent;
        this.prev = el.prev;
        if(this.prev)
            this.prev.next = this;
        this.next = el;
        el.prev = this;
        
        if(this.parent && el === this.parent.firstChild)
            this.parent.firstChild = this;

        this.jQ().insertBefore(el.jQ);
        
        return this;
    },
    detach: function()
    {
        this.jQ().detach();

        if(this.prev)
            this.prev.next = this.next;
        if(this.next)
            this.next.prev = this.prev;
        if(this.parent.firstChild === this)
            this.parent.firstChild = this.next;
        if(this.parent.lastChild === this)
            this.parent.lastChild = this.prev;
        
        this.prev = this.next = this.parent = null;

        return this;
    },
    remove: function()
    { 
      this.detach();
      this.jQ().remove();
    },
    eachChild: function(fn)
    {
      for(el = this.firstChild; el !== null; el = el.next)
        fn.call(el);
    },
    eachChildRev: function(fn)
    { 
      for(el = this.lastChild; el !== null; el = el.prev)
        fn.call(el);
    },
  }

  function MathBlock()
  { 
    if(commands)
      for (var i = 0; i < commands.length; i += 1)
        commands[i].appendTo(this);
    return this;
  }
  MathBlock.prototype = jQuery.extend({}, mathElement, { 
    html: function()
    { 
      var html = '';
      this.eachChild(function(){
        html += this.html();
      });
      return html;
    },
  });

  function RootMathBlock(dom)
  {
    jQuery(dom).replaceWith(this.jQ());
    this.cursor = new Cursor(this);
    this.jQ().data('cursor', this.cursor);
  }
  RootMathBlock.prototype = jQuery.extend({}, MathBlock.prototype, {
  });

  function MathOperator(cmd, html_template)
  { 
    this.command = cmd;
    this.html_template = html_template;
    this.__initBlocks();
  }
  MathOperator.prototype = jQuery.extend({}, mathElement, {
    __initBlocks: function()
    {
      for(var i = 0; i < this.html_template.length - 1; i += 1)
        (new MathBlock).appendTo(this); 
    },
    latex: function()
    {
      var rendered = this.cmd
      this.eachChild(function(){
        rendered += '{' + this.latex() + '}';
      }
      return rendered;
    },
    html: function()
    {
      var i = 0;
      rendered = this.html_template[0]

      that = this;
      this.eachChild(function(){
        i += 1;
        try {
          rendered += this.html() + that.html_template[i]
        } catch(e) {
          //since there may be any number of blocks,
          //we have to take into account the case
          //in which html_template.length < 1 + number of blocks.
          //in this case, just silently fail.
        }
      });
      return rendered;
    },
    //placeholder for context-sensitive spacing.
    respace: function() { return this; }
  });

  //expose public method to jQuery.  
  //this is intended to be called
  //on a jQuery object.
  return function()
  {
    return jQuery(this).replaceWith(new MathRootBlock());
  }

}());