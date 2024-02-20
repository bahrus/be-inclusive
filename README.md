# be-inclusive [WIP]

*be-inclusive* enables weaving templates together.  

[![Playwright Tests](https://github.com/bahrus/be-inclusive/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-inclusive/actions/workflows/CI.yml)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/be-inclusive)
<a href="https://nodei.co/npm/be-inclusive/"><img src="https://nodei.co/npm/be-inclusive.png"></a>

Like other [be-enhanced](https://github.com/bahrus/be-enhanced) based [custom enhancements](https://github.com/WICG/webcomponents/issues/1000), be-inclusive can use attributes to enhance the functionality of the element it adorns.  

However, the core functionality be-inclusive addresses seems [so fundamental and important](https://github.com/bahrus/mount-observer?tab=readme-ov-file#birtual-inclusions), that its functionality is already built into the underlying infrastructure supporting custom enhancements and binding from a distance (like [trans-rendering](https://github.com/bahrus/trans-render) supports).

Namely, without any help from this particular package, we can already do:

```html
<template id="Friday">
    <div>It's <slot name=day5></slot> I'm in love</div>
</template>

<div>I don't care if <slot name=day1></slot>'s blue</div>
<div><slot name=day2></slot>'s gray and <slot name=day3></slot> too</div>
<div><slot name=day4></slot> I don't care about you</div>
<template href=#Friday>
    <span slot=day5>Friday</span>
</template>
```

... and the last element (*template*) will be replaced with the template content.

This syntax allows IDE's like VS Code to be able to jump to the source without the need for extensions being installed.

The syntax could also be used to good effect during a build process (SSG) or while server-side rendering, or in a service worker, [w3c willing](https://github.com/whatwg/dom/issues/1217#issuecomment-1694483432).  If used with server-side rendering, the resulting HTML could be significantly heavier (even after factoring in gzip), so it could often be a net loss to do so on the server, rather than on the client.  This package contains no such support currently for server-side rendering.  

## Example 1 - Simplest example with no value added from this package, no slots

Song lyrics can be "deconstructed" and repetitive sections (like the chorus) shared, without a single line of JavaScript (once the MountObserver API is loaded).

Please expand below to see the "code".

<details>
<summary>Applying DRY to punk lyrics</summary>

```html
    <a rel=noopener href="https://www.youtube.com/watch?v=tWbrAWmhDwY" target="_blank">Something's gone wrong again</a>
    <template id="title">Something's gone wrong again</template>
    <template id="title2">Something goes wrong again</template>
    <template id="again">And again</template>
    <template id="again2">And again, and again, again and something's gone wrong again</template>
    <template id="again3">And again, and again, again and something goes wrong again</template>
    <template id="agains">
        <template href=#again></template> <br>
        <template href=#again2></template> <br>
        <template href=#title></template> 
    </template>
    <template id="agains2">
        <template href=#title2></template> <br>
        <template href=#again></template> <br>
        <template href=#again3></template> <br>
        <template href=#title2></template> 
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
            <template href=#title></template> <br>
            <span>Need a shave</span><br>
            <span>Cut myself, need a new blade</span><br>
            <template href=#title></template> 
        </div>
        <template href=#agains></template> 
        <div>
            <span>Tried to fry an egg</span><br>
            <span>Broke the yolk, no joke</span><br>
            <template href=#title></template> <br>
            <span>Look at my watch, just to tell the time but the hand's come off mine</span><br>
            <template href=#title></template> <br>
            <template href=#title></template> 
        </div>
        <template href=#agains></template> 
        <template href=#bus></template> 
        <template href=#agains></template> 
        <template href=#agains></template> 
        <template href=#bus></template> 
        <template href=#agains></template> 
        <div>
            <span>I turned up early in time for our date</span><br>
            <span>But then you turn up late, something goes wrong again</span><br>
            <span>Need a drink, go to the pub</span><br>
            <span>But the bugger's shut, something goes wrong again</span>
        </div>
        <div>
            <template href=#title2></template> <br>
            <template href=#again></template> <br>
            <template href=#again3></template> 
            <span>Ah, something goes wrong again</span><br>
            <template href=#title2></template> <br>
            <template href=#title2></template> 
        </div>
    </template>

    <template href="#main"></template> 

```

</details>

## Value-add of be-inclusive 

The built-in inclusiveness that the mount-observer api supports has a fundamental limitation that Shadow DOM slots don't have -- with these "birtual inclusions", all traces of  "slots" vanish so as not to conflict in any way with the ShadowDOM support that slots provide.

And more significantly, the mechanism for updating the slots and having them be projected into the ShadowDOM is completely non existent with this solution.  That is the primary value-add of this library -- to provide some ability to emulate that feature (if you squint your eyes enough).  Basically, we turn the information contained in the slots into a "model", which we can then update via JavaScript (or declarative binding).

## be-inclusive in a nutshell

```html
<template id="Friday">
    <div>It's <slot name=day5></slot> I'm in love</div>
</template>
<template id="Opening">
    <div class=stanza>
        <div>I don't care if <slot name=day1></slot>'s blue</div>
        <div><slot name=day2></slot>'s gray and <slot name=day3></slot> too</div>
        <div><slot name=day4></slot> I don't care about you</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template>
    </div>
</template>

<template id="love">
    <template href=#Opening>
        <slot slot=day1 name=day1></slot>
        <slot slot=day2 name=day2></slot>
        <slot slot=day3 name=day3></slot>
        <slot slot=day4 name=day4></slot>
        <slot slot=day5 name=day5></slot>
    </template>
    <div class="stanza">
        <div><slot name=day1></slot> you can fall apart</div>
        <div><slot name=day2></slot> <slot name=day3></slot> break my heart</div>
        <div>Oh, <slot name=day4></slot> doesn't even start</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template>
    </div>
    ...
</template>

<template id=song 
    be-inclusive='{
        "of": "#love",
        "slotMap": {"span": "|"},
        "xform": {
            "| day1": 0,
            "| day2": 0,
            "| day3": 0,
            "| day4": 0,
            "| day5": 0,
            "| day6": 0,
            "| day7": 0
        },
        "initModel": {}
    }'
>
    <span slot=day1 init-val-from="textContent">Monday</span>
    <span slot=day2 init-val-from="textContent">Tuesday</span>
    <span slot=day3 init-val-from="textContent">Wednesday</span>
    <span slot=day4 init-val-from="textContent">Thursday</span>
    <span slot=day5 init-val-from="textContent">Friday</span>
    <span slot=day6 init-val-from="textContent">Saturday</span>
    <span slot=day7 init-val-from="textContent">Sunday</span>
</template>
<button onclick="updateModel()">Wi not trei a holiday in Sweeden this yer</button>
<script>
    function updateModel(){
        const model = {
            day1: 'måndag', day2: 'tisdag', day3: 'onsdag', day4: 'torsdag', day5: 'fredag',
            day6: 'lördag', day7: 'söndag',
        };
        Object.assign(song.beEnhanced.beInclusive.model, model);
        //target.setAttribute('be-inclusive', JSON.stringify({model}));
    }
</script>
```


What this does:


1.  Updates the initModel via the slots:  querySelectorAll('[slot][init-val-from]').forEach(el => model[el.slot] = getVal(el, el.getAttribute('init-val-from')))
2.  Adds event listener of adorned element for event "load", which MountObserver dispatches after it is done template weaving.
2.  Sets the adorned element's href attribute to "of" parameter
3.  Applies the xform via trans-render's Transform api.

## Example 2 in detail

To see the full example described above in detail, please expand below

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
        };
        Object.assign(song.beEnhanced.beInclusive.model, model);
    }
</script>
<template id="Friday">
    <div>It's <slot name=day5></slot> I'm in love</div>
</template>
<template id="Opening">
    <div class=stanza>
        <div>I don't care if <slot name=day1></slot>'s blue</div>
        <div><slot name=day2></slot>'s gray and <slot name=day3></slot> too</div>
        <div><slot name=day4></slot> I don't care about you</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template> 
    </div>
</template>

<template id="love">
    <template href=#Opening>
        <slot slot=day1 name=day1></slot>
        <slot slot=day2 name=day2></slot>
        <slot slot=day3 name=day3></slot>
        <slot slot=day4 name=day4></slot>
        <slot slot=day5 name=day5></slot>
    </template> 
    <div class="stanza">
        <div><slot name=day1></slot> you can fall apart</div>
        <div><slot name=day2></slot> <slot name=day3></slot> break my heart</div>
        <div>Oh, <slot name=day4></slot> doesn't even start</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template> 
    </div>
    <div class="stanza">
        <div><slot name=day6></slot> wait</div>
        <div>And <slot name=day7></slot> always comes too late</div>
        <div>But <slot name=day5></slot> never hesitate</div>
    </div>

    <div class="stanza">
        <div>I don't care if <slot name=day1></slot>'s black</div>
        <div><slot name=day2></slot>, <slot name=day3></slot> heart attack</div>
        <div><slot name=day4></slot> never looking back</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template> 
    </div>
    <div class="stanza">
        <div><slot name=day1></slot> you can hold your head</div>
        <div><slot name=day2></slot>, <slot name=day3></slot> stay in bed</div>
        <div>Or <slot name=day4></slot> watch the walls instead</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template> 
    </div>
    <div class="stanza">
        <div><slot name=day6></slot> wait</div>
        <div>And <slot name=day7></slot> always comes too late</div>
        <div>But <slot name=day5></slot> never hesitate</div>
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
        <div>It's <slot name=day5></slot></div>
        <div>I'm in love</div>
    </div>
    <template href=#Opening>
        <slot slot=day1 name=day1></slot>
        <slot slot=day2 name=day2></slot>
        <slot slot=day3 name=day3></slot>
        <slot slot=day4 name=day4></slot>
        <slot slot=day5 name=day5></slot>
    </template> 
    <div class="stanza">
        <div><slot name=day1></slot> you can fall apart</div>
        <div><slot name=day2></slot>, <slot name=day3></slot> break my heart</div>
        <div><slot name=day4></slot> doesn't even start</div>
        <template href=#Friday>
            <slot slot=day5 name=day5></slot>
        </template> 
    </div>
    <style>
        .stanza{
        padding-top: 20px;
    }
</style>
</template>

<template id=song 
    be-inclusive='{
        "of": "#love",
        "slotMap": {"span": "|"},
        "xform": {
            "| day1": 0,
            "| day2": 0,
            "| day3": 0,
            "| day4": 0,
            "| day5": 0,
            "| day6": 0,
            "| day7": 0
        },
        "initModel": {}
    }'
>
    <span slot=day1 init-val-from="textContent">Monday</span>
    <span slot=day2 init-val-from="textContent">Tuesday</span>
    <span slot=day3 init-val-from="textContent">Wednesday</span>
    <span slot=day4 init-val-from="textContent">Thursday</span>
    <span slot=day5 init-val-from="textContent">Friday</span>
    <span slot=day6 init-val-from="textContent">Saturday</span>
    <span slot=day7 init-val-from="textContent">Sunday</span>
</template>
```

</details>

## Example 3 - Adventures with the Shadow DOM

In the example below, this package again provides nothing beyond what is supported in the underlying libary on which *be-inclusive* rests -- the MountObserver.  Here we use slots / Shadow DOM in all its glory, using the platform's ability to update slots as needed, combined with the MountObserver's support for template importing (with ShadowDOM open/closed mode).

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
    <div>
        <slot name=subjectIs></slot> beautiful
    </div>
</template>
<template id=down>
    <div>So don't you bring me down today</div>
</template>
<template id=chorus>
    <div>
        <template href=#beautiful shadowRootModeOnLoad=open></template>
        <span slot=subjectIs>
            <slot name=subjectIs1></slot>
        </span>
    </div>

    
    <div>No matter what they say</div>
    <div prop-pronoun>Words
        <slot name=verb1></slot> bring
        <slot name=pronoun1></slot> down</div>
    <div>Oh no</div>
    <div>
        <template href=#beautiful shadowRootModeOnLoad=open></template>
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
    
    <template href=#down></template>
    </template>
    
    <div class=chorus>
    <template href=#chorus shadowRootModeOnLoad=open></template>
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
    <div class=chorus>
        <template href=#chorus shadowRootModeOnLoad=open></template>
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
    No matter what we <slot name=verb1></slot> (no matter what we <slot name=verb2></slot>)
</template>
<div>
    <template href=#no-matter shadowRootModeOnLoad=open></template>
    <span slot=verb1>do</span>
    <span slot=verb2>do</span>
</div>
<div>
    <template href=#no-matter shadowRootModeOnLoad=open></template>
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
    <div class=chorus>
        <template href=#chorus shadowRootModeOnLoad=open></template>
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



## Example 4 - Applying DRY to the song of the material universe [TODO]


The [Periodic Table Codepen](https://codepen.io/mikegolus/pen/OwrPgB) has lots of repetitive, periodic DOM in it.  Performance can actually be improved over server-rendering all ths HTML by utilizing templates for the purpose of reducing repeating HTML (yes, it even improves over HTML with gzip in place).

In order to support this, some features have been added to *be-inclusive* -- specifying arrays of includes, and prepending when needed.

The markup can be found [here](https://github.com/bahrus/be-inclusive/blob/baseline/demo/periodic_table.html).


[TODO] beatify

[WIP] share templates

## Viewing Demos Locally

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.













