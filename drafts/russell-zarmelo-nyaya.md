#### The Russell-Zarmelo Paradox

So far, we've talked about stuff that is part of the real historical canon of Navyanyāya. Below, I'll apply some of these ideas to talking about the Russel-Zarmelo paradox. Although I personally don't know of a discussion of this paradox in an actual Nyāya text, puzzles
about self-reference are something Naiyyāyikas do talk about (as we mentioned earlier, with regard to Udayāna's discussion about 'natural types'). So, the topic is still within the broad canvas of Navyanyāya issues.

The paradox in its original setting was intended to show that set theory with unrestricted set comprehensions, i.e. the ability to define a set on the basis of any arbitrary property, is inconsistent. The idea is to
define a set S as 'all objects that have the property P', where P is 'the property of not being being a member of itself'. 

Then, the question is if S has the property P. If S does not have P; then, S would be a member of itself. But, that would mean S does have the property P, since ever member of S has P, by definition. But, this is a contradiction: S both has and lacks P. Now, if S *does* have P, then it would not be a member or itself. But, since everything that has P is a member of S, S would be a member of itself; leading to another contradiction: S both is and is not a member of itself.

In order to address this problem, it seems like you have to either redesign your language (as in Russell's ramified type theory), or adjust your axioms (as in ZFs axiom schema of separation) such that sets like S can't be proven to exist.

In order to reconstruct this problem in the Navyanyāya framework, we have to first construct a definition of P:

<div>
P = (t̂⊥ι t̂)λ <br>
प: = आत्म।अभावः।वत्।त्वम्
</div>
{: .quote .example}
Example (10.8.1)
{: .examplecaption}

Now, since in Nyāya we work directly with properties, instead of with
sets, we can ask if P is realized in itself?

<div>
?> P :: P
→ P :: (t̂⊥ι t̂)λ <br>
→ P t̂⊥ι t̂ <br>
→ P P⊥ι <br>
→ P :: P⊥ <br>
</div>
{: .quote .example}
Example (10.8.2)
{: .examplecaption}

Which results in an assertion that looks inconsistent with the assumption `P::P`.

What about the alternative:

<div>
?> P :: P⊥ <br>
→ P P⊥ι <br>
→ P (P t̂)⊥ι t̂ <br>
→ P t̂⊥ι t̂ <br>
→ P :: (t̂⊥ι t̂)λ <br>
→ P :: P
</div>
{: .quote .example}
Example (10.8.3)
{: .examplecaption}

Which also looks inconsistent.

Except: we're only dealing with `⊥` and not `ˉ`. And since only `ˉ` can trigger genuine contradictions, this the inconsistency is only apparent (i.e. its paraconsistent).

What if we define P as

<div>
P = (t̂ιˉι t̂)λ <br>
पः = आत्म।वत्।भेद।वत्।त्वम्
</div>
{: .quote .example}
Example (10.8.4)
{: .examplecaption}

Then, for ? `P: P` we get

<div>
?> P :: P <br>
→ P :: (t̂ιˉι t̂)λ <br>
→ P Pιˉι <br>
→ P :: Pιˉ
</div>
{: .quote .example}
Example (10.8.5)
{: .examplecaption}

but:

<div>
?> P :: P <br>
→ P :: Pιλ
</div>
{: .quote .example}
Example (10.8.5)
{: .examplecaption}

Which is a genuine contradiction. This leaves:

<div>
?> P :: P⊥ <br>
→ P P⊥ι <br>
→ P t̂⊥ι t̂ <br>
→ P :: (t̂⊥ι t̂)λ
</div>
{: .quote .example}
Example (10.8.6)
{: .examplecaption}

But notice that this time around, the property  `(t̂⊥ι t̂)λ` is not the same thing as `P`. So, you can't substitute `—> P :: P` to get the contradiction going.

But, how do we interpret assertions like: `P::P⊥`? If they're not contradictions, then what are they? As we discussed earlier (in the section on pure negatives), Naiyyāyikas interpret this as something that fails to express an internally consistent assertion not because `P` is paradoxical but because it is indeterminate. To review, in Navyanyāya jargon, the co-realization of a property and its absence in the same basis is called **incomplete realization** [अव्याप्यवृत्तिः; avyāpyavr̥ttiḥ] and is resolved by distinguishing the partition [अवच्छेदकभेदेन; avacchedakabhedena] over which the property operates from that of its absence. 

For example, let's stipulate that there exists some type `D` such that completely excludes (i.e. is completely unrealized in) `P`. Then, given the type `DΞ P`; we can ask:

<div>
?> P :: DΞ P <br>
→ P :: DΞ (t̂⊥ι t̂)λ <br>
→ P Dι P⊥ι <br>
→ P :: Dιλ
</div>
{: .quote .example}
Example (10.8.7)
{: .examplecaption}

which is inconsistent with our initial stipulation that `P:Dιˉ`.

So, we can infer that `P::(DΞ P)` is false — `P::(DΞ P)⊥`. This implies one of the following alternatives:

<div>
1. P :: D⊥ <br>
2. P :: DΞ P⊥
</div>
{: .quote .example}
Example (10.8.8)
{: .examplecaption}

And (1) is straightforwardly true. Notice how the presence of the partitioning term prevents us from proving (2), which would lead to the paraconsistent pair of assertions `P::(DΞ P). P::(DΞ P⊥)`. This successfully perserves a classical form of consistency, so long as the partitioning type is either completely realized or unrealized in its basis. In other words, partitioning acts as something like a domain restriction, ala restricted set comprehensions. But it is optional, merely transporting us from a paraconsistent to a classically consistent logical system.

