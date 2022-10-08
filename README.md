# be-inclusive

*be-inclusive* enables merging templates together.  

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-inclusive)

<a href="https://nodei.co/npm/be-inclusive/"><img src="https://nodei.co/npm/be-inclusive.png"></a>


Like other [be-decorated](https://github.com/bahrus/be-decorated) based web components, be-inclusive uses attributes to enhance the functionality of the element it adorns:

```html
<template id="Friday">
    <div>It's <span class=day5></span> I'm in love</div>
</template>

<div>I don't care if <span class=day1></span>'s blue</div>
<div><span class=day2></span>'s gray and <span class=day3></span> too</div>
<div><span class=day4></span> I don't care about you</div>
<div be-inclusive=Friday></div>

```

*data-be-inclusive* can also be used, in order to be strictly HTML5 compliant.

be-inclusive is a useful syntax for two fundamental in-browser scenarios:

1.  In the live DOM tree
2.  During template instantiation.

The syntax could also be used to good effect during a build process (SSG) (especially the "virtual inclusions" discussed below) or while server-side rendering.  If used with server-side rendering, the resulting HTML could be significantly larger, so it could often be a net loss to do so on the server, rather than on the client.

The syntax could also serve a useful purpose on the server-side or in a service worker, but this package provides no support for this.

Like other "isomorphic" be-decorated decorators, be-inclusive includes a [DTR plugin](https://github.com/bahrus/trans-render#extending-dtr-horizontally--via-dynamically-imported-plugins) for template instantiation.  But if be-inclusive has not been loaded yet, Без проблем, the DTR library ignores the template without including the template references, so that rendering isn't blocked, and then lets the support for enhancing live DOM tree that be-inclusive also provides accomplish the same thing (but with a little more rendering strain on the browser).

Alternative attributes (be-inc?  be-string?) can be specified with the help of the [be-hive](https://github.com/bahrus/be-hive) web component, while avoiding conflicts with other libraries.


## Example 1 -- slotted content with Shadow DOM

Song lyrics can be "deconstructed" and repetitive sections (like the chorus) shared, without a single line of JavaScript (once the be-inclusive library is loaded).

Please expand below to see the "code".

<details>
<summary>Sample Markup</summary>

```html
    <style>
        div {
        background-color: cornsilk;
        }
    </style>
        
    <h3><a href="https://www.youtube.com/watch?v=eAfyFTzZDMM" target="_blank">Beautiful</a></h3>
    <h4>Christina Aguilera</h4>
    
    <p>Don't look at me</p>
    <p>
        <div>Everyday is so wonderful</div>
        <div>Then suddenly</div>
        <div>It's hard to breathe</div>
        <div>Now and then I get insecure</div>
        <div>From all the pain</div>
        <div>I'm so ashamed</div>
    </p>


    <template id=beautiful>
        <style>
        div {
            background-color: burlywood;
        }
        </style>
        <div>
        <slot name=subjectIs></slot> beautiful
        </div>
    </template>
    <template id=down>
        <div>So don't you bring me down today</div>
    </template>
    <template id=chorus>
        <style>
        div {
            background-color: paleturquoise;
        }
        </style>

        <div be-inclusive='{
            "of": "beautiful",
            "shadow": "open"
        }'>
            <span slot=subjectIs>
                <slot name=subjectIs1></slot>
            </span>
        </div>
        <div>No matter what they say</div>
        <div prop-pronoun>Words
            <slot name=verb1></slot> bring
            <slot name=pronoun1></slot> down</div>
        <div>Oh no</div>
        <div be-inclusive='{
            "of": "beautiful",
            "shadow": "open"
        }'>
            <span slot=subjectIs>
                <slot name=subjectIs2></slot>
            </span>
        </div>
        <div>In every single way</div>
        <div>Yes words
            <slot name=verb2></slot> bring
            <slot name=pronoun2></slot> down
        </div>
        <div>Oh no</div>

        <div be-inclusive=down></div>
        <be-inclusive></be-inclusive>
    </template>

    <div be-inclusive='{
        "of": "chorus",
        "shadow": "open"
    }'>
        <span slot=verb1>can't</span>
        <span slot=verb2>can't</span>
        <span slot=pronoun1>me</span>
        <span slot=pronoun2>me</span>
        <span slot=subjectIs1>I am</span>
        <span slot=subjectIs2>I am</span>
    </div>

    <p>
        <div>To all your friends you're delirious</div>
        <div>So consumed</div>
        <div>In all your doom, ooh</div>
        <div>Trying hard to fill the emptiness</div>
        <div>The pieces gone</div>
        <div>Left the puzzle undone</div>
        <div>Ain't that the way it is</div>
    </p>
    <p>
        <div be-inclusive='{
            "of": "chorus",
            "shadow": "open"
        }'>
            <span slot=verb1>can't</span>
            <span slot=verb2>can't</span>
            <span slot=pronoun1>you</span>
            <span slot=pronoun2>you</span>
            <span slot=subjectIs1>You are</span>
            <span slot=subjectIs2>You are</span>
        </div>
    </p>
    <br>
    <template id=no-matter>
        <style>
        :host {
            background-color: blanchedalmond;
        }
        </style>
        No matter what we <slot name=verb1></slot> (no matter what we <slot name=verb2></slot>)
    </template>
    <div be-inclusive='{
        "of": "no-matter",
        "shadow": "open"
    }'>
        <span slot=verb1>do</span>
        <span slot=verb2>do</span>
    </div>
    <br>
    <div be-inclusive='{
        "of": "no-matter",
        "shadow": "open"
    }'>
        <span slot=verb1>say</span>
        <span slot=verb2>say</span>
    </div>
    <div>We're the song inside the tune (yeah, oh yeah)</div>
    <div>Full of beautiful mistakes</div>
    <p>
        <div>And everywhere we go (and everywhere we go)</div>
        <div>The sun will always shine (the sun will always, always, shine)</div>
        <div>And tomorrow we might awake</div>
        <div>On the other side</div>
    </p>
    <p>
        <div be-inclusive='{
            "of": "chorus",
            "shadow": "open"
        }'>
            <span slot=verb1>won't</span>
            <span slot=verb2>can't</span>
            <span slot=pronoun1>us</span>
            <span slot=pronoun2>us</span>
            <span slot=subjectIs1>We are</span>
            <span slot=subjectIs2>We are</span>
        </div>
    </p>
    <p>
        <div>Oh, oh</div>
        <div>Don't you bring me down today</div>
        <div>Don't you bring me down, ooh</div>
        <div>Today</div>
    </p>

```
</details>

To aid with avoiding syntax errors, which can be challenging when editing JSON inside HTML, a [vscode extension is available](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html) to help with this.  That extension is compatible with [web-based vscode solutions](https://github.dev/bahrus/be-inclusive).

## Example 2 - Without Shadow DOM

Please expand below to see how to include a template without using shadow DOM.  This is the default, and the syntax is simpler (no JSON required).

<details>
<summary>Applying DRY to punk lyrics</summary>

```html
    <a href="https://www.youtube.com/watch?v=tWbrAWmhDwY" target="_blank">Something's gone wrong again</a>
    <template id="Title">Something's gone wrong again</template>
    <template id="Title2">Something goes wrong again</template>
    <template id="Again">And again</template>
    <template id="Again2">And again, and again, again and something's gone wrong again</template>
    <template id="Again3">And again, and again, again and something goes wrong again</template>
    <template id="Agains">
        <span be-inclusive="Again"></span><br>
        <span be-inclusive="Again2"></span><br>
        <span be-inclusive="Title"></span>
    </template>
    <template id="Agains2">
        <span be-inclusive="Title2"></span><br>
        <span be-inclusive="Again"></span><br>
        <span be-inclusive="Again3"></span><br>
        <span be-inclusive="Title2"></span>
    </template>
    <template id="bus">
        <span>Nothing ever happens to people like us</span><br>
        <span>'Cept we miss the bus, something goes wrong again</span><br>
        <span>Need a smoke, use my last fifty P.</span><br>
        <span>But the machine is broke, something's gone wrong again</span>
    </template>
    <template id=main>
        <div>
            <span>Tried to find my sock</span><br>
            <span>No good, it's lost</span><br>
            <span be-inclusive="Title"></span><br>
            <span>Need a shave</span><br>
            <span>Cut myself, need a new blade</span><br>
            <span be-inclusive="Title"></span>
        </div>
        <div be-inclusive="Agains"></div>
        <div>
            <span>Tried to fry an egg</span><br>
            <span>Broke the yolk, no joke</span><br>
            <span be-inclusive="Title"></span><br>
            <span>Look at my watch, just to tell the time but the hand's come off mine</span><br>
            <span be-inclusive="Title"></span><br>
            <span be-inclusive="Title"></span>
        </div>
        <div be-inclusive="Agains"></div>
        <div be-inclusive="bus"></div>
        <div be-inclusive="Agains2"></div>
        <div be-inclusive="Agains2"></div>
        <div be-inclusive="bus"></div>
        <div be-inclusive="Agains2"></div>
        <div>
            <span>I turned up early in time for our date</span><br>
            <span>But then you turn up late, something goes wrong again</span><br>
            <span>Need a drink, go to the pub</span><br>
            <span>But the bugger's shut, something goes wrong again</span>
        </div>
        <div>
            <span be-inclusive="Title2"></span><br>
            <span be-inclusive="Again"></span><br>
            <span be-inclusive="Again3"></span><br>
            <span>Ah, something goes wrong again</span><br>
            <span be-inclusive="Title2"></span><br>
            <span be-inclusive="Title2"></span>
        </div>
    </template>

    <div be-inclusive="main"></div>

    <style>
        div{
            padding-top:20px;
        }
    </style>
```

</details>

## Example 3 - With Transform Support

We can use [trans-render](https://github.com/bahrus/trans-render) syntax in order to "stamp" the template before the template is added to the live DOM.  The same transform can be reapplied when the model changes.

<details>
    <summary>Tränslåtyng pøst pünk lyriks tø Sweedisλ</summary>

```html
<a href="https://www.youtube.com/watch?v=ucX9hVCQT_U" target="_blank">Friday I'm in Love</a>
<button id="changeDays" onclick="updateModel()">Wi not trei a holiday in Sweeden this yer</button>
<script>
    function updateModel(){
        const model = {
            day1: 'måndag', day2: 'tisdag', day3: 'onsdag', day4: 'torsdag', day5: 'fredag',
            day6: 'lördag', day7: 'söndag',
        }
        target.setAttribute('be-inclusive', JSON.stringify({model}));
    }
</script>
<template id="Friday">
    <div>It's <span class=day5></span> I'm in love</div>
</template>
<template id="Opening">
    <div>I don't care if <span class=day1></span>'s blue</div>
    <div><span class=day2></span>'s gray and <span class=day3></span> too</div>
    <div><span class=day4></span> I don't care about you</div>
    <div be-inclusive=Friday></div>
</template>

<template id="love">
    <div be-inclusive=Opening class="stanza"></div>
    <div class="stanza">
        <div><span class=day1></span> you can fall apart</div>
        <div><span class=day2></span> <span class=day3></span> break my heart</div>
        <div>Oh, <span class=day4></span> doesn't even start</div>
        <div be-inclusive=Friday></div>
    </div>
    <div class="stanza">
        <div><span class=day6></span> wait</div>
        <div>And <span class=day7></span> always comes too late</div>
        <div>But <span class=day5></span> never hesitate</div>
    </div>

    <div class="stanza">
        <div>I don't care if <span class=day1></span>'s black</div>
        <div><span class=day2></span>, <span class=day3></span> heart attack</div>
        <div><span class=day4></span> never looking back</div>
        <div be-inclusive=Friday></div>
    </div>
    <div class="stanza">
        <div><span class=day1></span> you can hold your head</div>
        <div><span class=day2></span>, <span class=day3></span> stay in bed</div>
        <div>Or <span class=day4></span> watch the walls instead</div>
        <div be-inclusive=Friday></div>
    </div>
    <div class="stanza">
        <div><span class=day6></span> wait</div>
        <div>And <span class=day7></span> always comes too late</div>
        <div>But <span class=day5></span> never hesitate</div>
    </div>
    <div class="stanza">
        <div>Dressed up to the eyes</div>
        <div>It's a wonderful surprise</div>
        <div>To see your shoes and your spirits rise</div>
        <div>Throwing out your frown</div>
        <div>And just smiling at the sound</div>
        <div>And as sleek as a shriek</div>
        <div>Spinning round and round</div>
        <div>Always take a big bite</div>
        <div>It's such a gorgeous sight</div>
        <div>To see you in the middle of the night</div>
        <div>You can never get enough</div>
        <div>Enough of this stuff</div>
        <div>It's <span class=day5></span></div>
        <div>I'm in love</div>
    </div>
    <div be-inclusive=Opening class="stanza"></div>
    <div class="stanza">
        <div><span class=day1></span> you can fall apart</div>
        <div><span class=day2></span>, <span class=day3></span> break my heart</div>
        <div><span class=day4></span> doesn't even start</div>
        <div be-inclusive=Friday></div>
    </div>
    <style>
        .stanza{
        padding-top: 20px;
    }
</style>
</template>
<div id=target be-inclusive='{
    "of": "love",
    "model": {
        "day1": "Monday",
        "day2": "Tuesday",
        "day3": "Wednesday",
        "day4": "Thursday",
        "day5": "Friday",
        "day6": "Saturday",
        "day7": "Sunday"
    },
    "transform":{
        ".day1": "day1",
        ".day2": "day2",
        ".day3": "day3",
        ".day4": "day4",
        ".day5": "day5",
        ".day6": "day6",
        ".day7": "day7"
    }
}'></div>
```

</details>

## Example 4 - Applying DRY to the song of the material universe


The [Periodic Table Codepen](https://codepen.io/mikegolus/pen/OwrPgB) has lots of repetitive, periodic DOM in it.  Performance can actually be improved by utilizing templates for this purpose.

In order to support this, some features have been added to *be-inclusive* -- specifying arrays of includes, and prepending when needed.

The markup can be found [here](https://github.com/bahrus/be-inclusive/blob/baseline/demo/periodic_table.html).

## Example 5 - Flattened, 'JSX' like [TODO]

Inclusions inside templates can take the form of temporary "custom element like" names with name [Lisp-case of the id] and attribute bi.  If the id is not a compound word, a dash is appended to the id for the name of the tag.  We'll refer to these as "virtual inclusions".  

If a virtual inclusion has no next siblings, then the contents of the template are appended using appendChild.

Else the contents are laboriously inserted using insertAdjacentElement.

Either way, we do have true "fragment" support.

```html
<template id=Friday>
    <div>It's <span class=day5></span> I'm in love</div>
</template>
<template id=Opening>
    <div>I don't care if <span class=day1></span>'s blue</div>
    <div><span class=day2></span>'s gray and <span class=day3></span> too</div>
    <div><span class=day4></span> I don't care about you</div>
    <div be-inclusive=Friday></div>
</template>
<template id=FallApart>
    <div class="stanza">
        <div><span class=day1></span> you can fall apart</div>
        <div><span class=day2></span> <span class=day3></span> break my heart</div>
        <div>Oh, <span class=day4></span> doesn't even start</div>
        <friday- bi/>
    </div>
</template>

<template id="love">
    <opening- bi/>
    <fall-apart bi/>
    <div class="stanza">
        <div><span class=day6></span> wait</div>
        <div>And <span class=day7></span> always comes too late</div>
        <div>But <span class=day5></span> never hesitate</div>
    </div>

    <div class="stanza">
        <div>I don't care if <span class=day1></span>'s black</div>
        <div><span class=day2></span>, <span class=day3></span> heart attack</div>
        <div><span class=day4></span> never looking back</div>
        <friday- bi/>
    </div>
    <div class="stanza">
        <div><span class=day1></span> you can hold your head</div>
        <div><span class=day2></span>, <span class=day3></span> stay in bed</div>
        <div>Or <span class=day4></span> watch the walls instead</div>
        <friday- bi/>
    </div>
    <div class="stanza">
        <div><span class=day6></span> wait</div>
        <div>And <span class=day7></span> always comes too late</div>
        <div>But <span class=day5></span> never hesitate</div>
    </div>
    <div class="stanza">
        <div>Dressed up to the eyes</div>
        <div>It's a wonderful surprise</div>
        <div>To see your shoes and your spirits rise</div>
        <div>Throwing out your frown</div>
        <div>And just smiling at the sound</div>
        <div>And as sleek as a shriek</div>
        <div>Spinning round and round</div>
        <div>Always take a big bite</div>
        <div>It's such a gorgeous sight</div>
        <div>To see you in the middle of the night</div>
        <div>You can never get enough</div>
        <div>Enough of this stuff</div>
        <div>It's <span class=day5></span></div>
        <div>I'm in love</div>
    </div>
    <friday- bi/>
    <fall-apart bi/>
    <style>
        .stanza{
        padding-top: 20px;
    }
</style>
</template>
<div id=target be-inclusive='{
    "of": "love",
    "model": {
        "day1": "Monday",
        "day2": "Tuesday",
        "day3": "Wednesday",
        "day4": "Thursday",
        "day5": "Friday",
        "day6": "Saturday",
        "day7": "Sunday"
    },
    "transform":{
        ".day1": "day1",
        ".day2": "day2",
        ".day3": "day3",
        ".day4": "day4",
        ".day5": "day5",
        ".day6": "day6",
        ".day7": "day7"
    }
}'></div>
```


## Viewing Demos Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.













