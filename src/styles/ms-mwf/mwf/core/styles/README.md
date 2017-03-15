# Sass Guidelines and Best Practices

Sass as a language is growing more and more complex with each iteration and with each update there are growing opportunities for anti-patterns to appear.

The goal of this document is to reference common anti-patterns in code that contributors should avoid.

## & misuse

In Sass the `&` is a special character that is used to dynamically reference the parent. So the following uses are accepted:

```
block {
  &,
  .foo {
    foo: bar;
  }
  .bar & {
    fizz: buzz;
  }
  &-element {
    water: boat;
  }
  &:hover {
    color: orange;
  }
}
```

The following anti-pattern is unnecessary as the `&` is referencing a parent in a nested node, so the CSS output is exactly the same as if you simply used the nesting pattern.

```
"BAD"
block {
  & .foo {
    foo: bar;
  }
}

"GOOD"
block {
  .foo {
    foo: bar;
  }
}
```

## Hard-coded selector chains

Many times it seems easier to simply write out a selector in the following way:

```
block .foo > .bar-element {
  things: foo;
}
```

This negates one of Sass most basic features, nesting. Maintainability, for example, in this chain there needs to be a rule at `block .foo > .bar`, there is no way to address this without duplicating the selector in the Sass. To avoid all of this, using nesting will set you up for success:

```
block {
  .foo {
    > .bar {
      foo: bar;
      &-element {
        things: foo;
      }
    }
  }
}
```

## Variables and interpolation

In Sass the common variable, `$var: value` is used in many ways. A common misuse of variables is in how they are applied.

The simple rule to follow is: when the value of the var is to be directly used in place of the var (as a string), then use interpolation. Values of a CSS property __DO NOT__ need interpolation. __DO NOT__ use interpolation if you intend Sass to perform a Sass function on the value(s). The following is an example of correct variable uses.

```
$foo: foo;
$bar: bar;
$width: 100px;
$height: 100px;

.block {
  // standard value replacement
  color: $foo;

  // interpolation needed because values are converted to a string
  content: "#{$foo} and #{$bar}";

  // interpolation needed for selector
  &-#{$foo} {

    // interpolation needed for selector; not needed for value
    #{$foo}: $bar;
  }

  // Interpolation needed as value is inside CSS3 function
  width: calc(100% - #{$width});

  // Standard Sass math using values from vars
  square: $width + $height;
}
```

Note, when the value of a variable is used in a interpolated function, the value is converted to a string. Take the following example, while this *will* output the value you are looking for ...

```
block {
  width: #{$width};
}
```

you can not perform additional functions. The following example ...

```
block {
  width: #{$width} - #{$width};
}
```

actually outputs the following:

```
block {
  width: 100px - 100px;
}
```

Where as the following example will output the expected result of `0`.

```
block {
  width: $width - $width;
}
```

## Using mixins

Mixins take arguments and output direct CSS into a selector, and at times even craete the selector from which CSS rules are put into. Common mixin with argiments will look like the following:

```
@mixin foo($arg, $var) {
  #{$arg}: $var;
}

block {
  @include foo(foo, bar);
}
```

A mixin can exist without any arguments and in these rare cases, the trailing `()` is __NOT__ needed. For example:

```
@mixin foo {
  foo: bar;
}

block {
  @include foo;
}
```

__NOTE:__ The trailing `()` is sometimes a confused with LESS whereas any selector was able to become a mixin by using a trailing `()`. This is not needed in Sass.

## Placeholder selectors and the @extend directive

Placeholder selectors and the `@extend` directive are powerful tools in the Sass language, but poor use can cause many issues with the quality of CSS output. A few rules to follow will ensure that CSS output is correct.

The following __DO NOT__ examples are to ensure that Sass does not recursively regurgitate long convulsed examples of extended selectors. Using the `@extend` directive, Sass will process every possible outcome it can find, and many times this will result in unforeseen output.

#### Never extend a native node
```
block {
  @extend p;
}
```

#### Never extend global selectors
```
block {
  @extend .clearfix;
}
```

#### Never nest placeholder selectors

```
%foo {
  color: yellow;
  %bar {
    color: red;
    %baz {
      color: orange;
    }
  }
}
```

The following __DO__ examples are considered safe and recommended solutions too problems.

#### All placeholder selectors should be at the root level

```
%foo {
  color: yellow;
}

%bar {
  color: red;
}

%baz {
  color: orange;
}
```

#### Only extend placeholder selectors from the root
```
%pattern {
  position: absolute;
  left: 0;
  top: 0;
}

block {
  @extend %pattern;
}
```

This is also acceptable.

```
block {
  .foo {
    extend %pattern;
  }
}
```