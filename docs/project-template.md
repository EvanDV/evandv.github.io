---
# Copy this file into src/content/projects/<slug>.md and fill it in.
# The <slug> becomes the URL: /projects/<slug>/
title: "Plain part of the title"
titleAccent: "italic amber part"     # optional
side: A                              # A = research, B = for fun
track: 9                             # A9, B9...
tag: THESIS                          # right-hand tag in the home page list (optional)
kind: "Master's thesis"              # header label; defaults to tag (optional)
summary: "One line, used on the home page and under the title."
pills: ["McGill · 2026", "CHIME"]
wip: true                            # adds a "Work in progress" pill
# hero: ./images/hero.png            # path relative to this file (optional)
# heroAlt: "What the image shows"
# heroCaption: "Fig. 1 — Caption in mono."
links:
  - label: "Thesis (PDF)"
    href: "https://example.com/thesis.pdf"
  - label: "Paper in preparation"    # no href = plain text
draft: true                          # true hides the page everywhere
---

Each `##` heading is a numbered section and appears in the sidebar tracklist.

## First section

Body text is plain Markdown. Inline math works: $m = \sigma_S / \langle S \rangle$.

Display math sits in a bordered panel:

$$
m = \frac{\sigma_S}{\langle S \rangle}
$$

A figure with a mono caption (keep the blank lines):

<figure>

![What the figure shows](./images/figure.png)

<figcaption>Fig. 2 — Caption.</figcaption>
</figure>

## A key result

The callout box highlights one number or finding (keep the blank lines):

<div class="callout">
<span class="callout-label">Candidate</span>
<span class="callout-value">248 <em>days</em></span>

Explanation in a sentence or two. Math works here too: $P_\text{rest} = P_\text{obs} / (1 + z)$.

</div>

## What's next

Closing section.
