# be-inclusive

be-inclusive is an attribute-based decorator equivalent of [carbon-copy](https://github.com/bahrus/carbon-copy). 

## Default settings

By default, the inclusion is done with ShadowDOM enabled.  This allows us to utilize the built-in slotting support.  

So, for example, song lyrics can be "deconstructed" and repetivive sections (like the chorus shared), without a single line of JavaScript (once the be-inclusive library is loaded).


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



    <template id=chorus>
        <style>
        div {
            background-color: paleturquoise;
        }
        </style>
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
        <div be-inclusive=beautiful>
            <span slot=subjectIs>
                <slot name=subjectIs1></slot>
            </span>
        </div>
        <div>No matter what they say</div>
        <div prop-pronoun>Words
            <slot name=verb1></slot> bring
            <slot name=pronoun1></slot> down</div>
        <div>Oh no</div>
        <div be-inclusive=beautiful>
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
        <template id=down>
            <div>So don't you bring me down today</div>
        </template>
        <div be-inclusive=down></div>
        <be-inclusive></be-inclusive>
    </template>

    <div be-inclusive=chorus>
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
        <div be-inclusive=chorus>
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
    <div be-inclusive=no-matter>
        <span slot=verb1>do</span>
        <span slot=verb2>do</span>
    </div>
    <br>
    <div be-inclusive=no-matter>
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
        <div be-inclusive=chorus>
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
<details>

## Without Shadow DOM



