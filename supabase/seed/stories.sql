-- Story text, scene rows, and placeholder media. Apply after the schema. Safe to re-run.
insert into public.stories (slug, title, summary, testament, start_ref, end_ref, body, age_band, is_bedtime, tier_required, order_index, review_status)
values
('creation', 'Creation', 'God speaks the world into being and calls it good.', 'OT', 'GEN.1.1', 'GEN.2.3', 'In the beginning God created the heavens and the earth. The earth was empty and dark, and the Spirit of God moved over the waters.

God said, “Let there be light,” and there was light. He called the light day and the darkness night.

God gathered the waters so dry land could appear, and he called the land earth. Then the earth brought out grass and trees with seed.

God set lights in the sky to mark days and seasons, a greater light for the day and a lesser light for the night.

The waters filled with living creatures, birds flew, and animals walked on the land, each of its kind. God saw that it was good.

God made people in his image and blessed them. On the seventh day he rested from the work he had done.', kids, true, 'free', 1, 'published'),
('adam-and-eve', 'Adam and Eve', 'The first people, a garden, and a choice that changes the story.', 'OT', 'GEN.2.7', 'GEN.3.24', 'God formed a man from the dust and breathed into him, and the man became a living person.

God planted a garden in Eden and put the man there to work it and take care of it. A river watered the garden.

None of the animals was the partner the man needed. God made a woman, and the man welcomed her.

The serpent asked about the one tree God had forbidden. The woman and the man both ate its fruit.

They heard God walking in the garden and hid. God called, “Where are you?”

God clothed them and sent them out of the garden. The way back was guarded.', kids, false, 'free', 2, 'published'),
('noah', 'Noah', 'A boat, a flood, and a promise painted in the sky.', 'OT', 'GEN.6.9', 'GEN.9.17', 'Noah walked with God while the earth was full of violence. God told him to build an ark.

Noah’s family and the animals went into the ark, as God had said.

Rain fell for forty days. The waters rose, and the ark floated above them.

When the waters went down, Noah sent out a dove. It returned with an olive leaf.

God told Noah to come out. Noah built an altar and thanked God.

God promised not to flood the whole earth again, and set a rainbow as the sign.', kids, true, 'free', 3, 'published'),
('tower-of-babel', 'Tower of Babel', 'People try to make a name for themselves, and their words scatter.', 'OT', 'GEN.11.1', 'GEN.11.9', 'The whole earth used the same words. As people moved east they found a plain.

They said, “Let’s make bricks,” and they used tar for mortar.

They planned a city and a tower that would reach the sky, so they would not be scattered.

God saw the city and the tower they were building.

God confused their language so they could not understand one another.

They stopped building and spread over the earth. The place was called Babel.', all, false, 'free', 4, 'published'),
('abrahams-promise', 'Abraham''s Promise', 'God calls Abram to go, and promises a family as many as the stars.', 'OT', 'GEN.12.1', 'GEN.15.6', 'God said to Abram, “Leave your country and your father’s house. I will show you a land.”

God said he would make Abram a great nation and that all families of the earth would be blessed in him.

Abram went, as God had told him, and Lot went with him. Abram was seventy-five.

Abram travelled through the land. God said, “I will give this land to your offspring.”

Later God brought Abram outside and said, “Count the stars, if you can. So shall your offspring be.”

Abram believed God, and God counted that faith as righteousness.', all, false, 'free', 5, 'published'),
('joseph', 'Joseph', 'A hated brother becomes the one who saves his family from hunger.', 'OT', 'GEN.37.3', 'GEN.45.8', 'Israel loved Joseph and gave him a special coat. Joseph’s brothers hated him for it.

The brothers threw Joseph into a pit and sold him. They told their father a wild animal had taken him.

Joseph was taken to Egypt. God was with him, even in a prison he did not deserve.

God helped Joseph explain Pharaoh’s dreams: seven good years, then seven years of hunger.

Pharaoh put Joseph in charge of storing grain so Egypt, and others, could live.

When the brothers came for food, Joseph told them who he was. “God sent me ahead of you to save lives.”', kids, false, 'free', 6, 'published'),
('baby-moses', 'Baby Moses', 'A baby is hidden in a basket, and a princess finds him.', 'OT', 'EXO.2.1', 'EXO.2.10', 'A man and woman from Levi had a son. They saw he was a fine child and hid him for three months.

When they could hide him no longer, his mother made a basket of reeds and set it in the reeds by the river.

The baby’s sister stood at a distance to see what would happen to him.

Pharaoh’s daughter came to bathe and saw the basket. She opened it, and the baby was crying.

The sister offered to find a Hebrew woman to nurse him. The princess agreed, and his own mother cared for him.

When the child grew, he was brought to Pharaoh’s daughter, and she named him Moses, because she drew him out of the water.', kids, true, 'free', 7, 'published'),
('the-exodus', 'The Exodus', 'The sea opens, and the people walk through on dry ground.', 'OT', 'EXO.14.10', 'EXO.14.31', 'Pharaoh’s army came near, and the people were afraid. They cried out to God.

Moses said, “Don’t be afraid. Stand still, and see the salvation of God.”

God told Moses to lift his staff and stretch his hand over the sea, and to tell the people to go forward.

God drove the sea back with a strong wind. The waters were a wall on the right and on the left.

The people of Israel walked through the sea on dry ground.

When they saw what God had done, the people feared God and believed him and his servant Moses.', all, false, 'free', 8, 'published'),
('ten-commandments', 'Ten Commandments', 'God speaks the words that will shape a people.', 'OT', 'EXO.20.1', 'EXO.20.17', 'God spoke all these words: “I am the LORD your God, who brought you out of Egypt.”

You shall have no other gods. You shall not make an idol or misuse God’s name.

Remember the sabbath day and keep it holy. Six days you work, and the seventh is a rest.

Honour your father and your mother, so that you may live long in the land.

Do not murder, do not commit adultery, do not steal, and do not lie about your neighbour.

Do not covet anything that belongs to your neighbour.', all, false, 'free', 9, 'published'),
('joshua-and-jericho', 'Joshua and Jericho', 'The city walls fall after a quiet week of walking.', 'OT', 'JOS.6.1', 'JOS.6.20', 'Jericho was shut up. No one went out and no one came in.

God told Joshua that the city was given to him, and told the people how to march.

Seven priests carried rams’ horns before the ark, and the armed men walked ahead.

For six days they marched around the city once and returned to camp.

On the seventh day they marched seven times. Joshua said, “Shout, for God has given you the city.”

The people shouted, the horns sounded, and the wall fell down flat.', kids, false, 'free', 10, 'published'),
('ruth', 'Ruth', 'A loyal daughter-in-law finds a home and a place in a larger story.', 'OT', 'RUT.1.16', 'RUT.4.17', 'Naomi urged her daughters-in-law to return to their own mothers. Orpah kissed her, but Ruth clung to her.

Ruth said, “Where you go, I will go. Your people will be my people, and your God my God.”

Ruth gleaned in the field of Boaz, a relative of Naomi’s husband.

Boaz told her to stay in his field and made sure she was safe and fed.

Naomi sent Ruth to ask Boaz to act as the family redeemer.

Boaz married Ruth. They had a son, and the women said God had not left Naomi without a redeemer.', all, false, 'free', 11, 'published'),
('samuel-hears-god', 'Samuel Hears God', 'A boy in the temple learns to say, “Speak, for your servant is listening.”', 'OT', '1SA.3.1', '1SA.3.10', 'The boy Samuel served God under Eli. The word of God was rare in those days, and the lamp had not yet gone out.

God called, “Samuel.” Samuel ran to Eli and said, “Here I am.”

Eli said he had not called. This happened three times.

Eli realised God was calling the boy. He told Samuel what to say.

Samuel went back and lay down. God came and called as before.

Samuel answered, “Speak, for your servant is listening.”', kids, true, 'free', 12, 'published'),
('david-and-goliath', 'David and Goliath', 'A shepherd faces a giant with a sling and a name he trusts.', 'OT', '1SA.17.4', '1SA.17.50', 'A champion named Goliath came out from the Philistine camp. He was very tall, and he taunted Israel.

Every morning and evening Goliath took his stand. Saul and Israel were dismayed.

David had come to bring food to his brothers. He heard the taunt and asked what it meant.

David said he had protected his sheep from lion and bear, and he would face this Philistine too.

He took his staff, five smooth stones, and his sling. He refused Saul’s armour.

David said he came in the name of the LORD. The stone struck Goliath, and the giant fell.', kids, false, 'free', 13, 'published'),
('solomons-wisdom', 'Solomon''s Wisdom', 'A young king asks for a listening heart, and then has to use it.', 'OT', '1KI.3.5', '1KI.3.28', 'At Gibeon, God said to Solomon in a dream, “Ask what I should give you.”

Solomon asked for an understanding heart to judge God’s people, not for long life or riches.

God was pleased and gave him a wise and discerning heart, and also what he had not asked.

Two women came, each saying the living child was hers.

Solomon said, “Bring a sword.” He suggested dividing the child, to see who would refuse.

The real mother begged him to give the child to the other woman. Solomon gave the boy to her.', all, false, 'free', 14, 'published'),
('elijah', 'Elijah', 'Fire on the mountain, and then a quiet voice in the wilderness.', 'OT', '1KI.18.20', '1KI.19.13', 'Elijah met the prophets of Baal on Mount Carmel and said the people must choose whom they would serve.

The prophets of Baal called all day. There was no voice and no answer.

Elijah repaired the altar of the LORD, laid the offering on it, and had water poured over it.

Elijah prayed, and the fire of God fell and consumed the offering.

Later Elijah fled, sat under a broom tree, and asked to die. An angel fed him.

On the mountain, God was not in the wind, the earthquake, or the fire. Then came a low whisper.', all, false, 'free', 15, 'published'),
('daniel', 'Daniel in the Lions'' Den', 'Daniel keeps praying, and God shuts the lions’ mouths.', 'OT', 'DAN.6.10', 'DAN.6.23', 'Officials tricked the king into a law: for thirty days, pray only to the king, or be thrown to the lions.

Daniel went home, knelt at his open window toward Jerusalem, and prayed as he always had.

The officials found him praying and told the king.

The king was distressed, but the law stood. Daniel was put into the lions’ den.

At first light the king hurried to the den and called out in anguish.

Daniel answered, “My God sent his angel and shut the lions’ mouths.” The king was overjoyed.', kids, true, 'free', 16, 'published'),
('jonah', 'Jonah', 'A prophet runs the other way, and a city he dislikes is spared.', 'OT', 'JON.1.1', 'JON.3.10', 'God told Jonah to go to Nineveh. Jonah boarded a ship for Tarshish instead.

God sent a great wind. The sailors were afraid, and Jonah was asleep below.

Jonah said the storm was because of him. They threw him into the sea, and it grew calm.

God provided a great fish to swallow Jonah. Jonah was in the fish three days and three nights.

The fish put him on dry land. Jonah went to Nineveh and warned the city.

The people of Nineveh believed God and turned from their violence. God relented.', kids, true, 'free', 17, 'published'),
('esther', 'Esther', 'A queen risks her life to speak for her people.', 'OT', 'EST.4.12', 'EST.7.6', 'A decree went out against the Jewish people. Mordecai tore his clothes and mourned.

Mordecai told Esther, “Who knows whether you have come to the kingdom for such a time as this?”

Esther asked her people to fast. Then she said, “I will go to the king, and if I perish, I perish.”

She stood in the inner court. The king held out the golden sceptre, and she lived.

Esther invited the king and Haman to a banquet, and then to another.

At the second banquet she asked for her life and her people’s life, and named the man who threatened them.', all, false, 'free', 18, 'published'),
('the-nativity', 'The Nativity', 'A child is born in Bethlehem, and shepherds hear the news first.', 'NT', 'LUK.2.1', 'LUK.2.20', 'Caesar’s decree sent everyone to their own town. Joseph went to Bethlehem with Mary, who was expecting a child.

While they were there, the time came for the baby to be born. She laid him in a manger, because there was no room.

Shepherds were staying in the fields, keeping watch over their flock by night.

An angel said, “Don’t be afraid. I bring good news of great joy. A Saviour is born.”

A crowd of angels praised God: “Glory to God in the highest, and on earth peace.”

The shepherds hurried to Bethlehem, found the baby, and told what they had heard.', kids, true, 'free', 19, 'published'),
('boy-jesus', 'Boy Jesus in the Temple', 'A twelve-year-old stays behind in the temple, listening and asking questions.', 'NT', 'LUK.2.41', 'LUK.2.52', 'Every year Jesus’ parents went to Jerusalem for the Passover.

When he was twelve they went as usual. On the way home they realised he was not with the group.

They searched and found him in the temple, sitting among the teachers.

He was listening to them and asking questions. Everyone who heard him was amazed.

His mother said they had been anxiously searching. He asked, “Didn’t you know I must be in my Father’s house?”

He went back to Nazareth with them and was obedient. Jesus grew in wisdom and stature.', all, false, 'free', 20, 'published'),
('jesus-baptism', 'Jesus'' Baptism', 'Jesus steps into the river, and a voice from heaven names him the beloved Son.', 'NT', 'MAT.3.13', 'MAT.3.17', 'John the Baptist was in the wilderness, calling people to turn and be baptised.

He said someone greater was coming, whose sandals he was not worthy to carry.

Jesus came from Galilee to the Jordan to be baptised by John.

John tried to stop him and said, “I need to be baptised by you.”

Jesus answered that it was right to fulfil all righteousness. Then John baptised him.

The Spirit descended like a dove, and a voice said, “This is my beloved Son, with whom I am well pleased.”', all, false, 'free', 21, 'published'),
('calming-the-storm', 'Calming the Storm', 'Wind and waves obey a word spoken from a boat.', 'NT', 'MRK.4.35', 'MRK.4.41', 'When evening came, Jesus said to his disciples, “Let’s go over to the other side.”

A great windstorm rose. Waves beat into the boat. Jesus was in the stern, asleep on a cushion.

They woke him and said, “Teacher, don’t you care that we are dying?”

He awoke, rebuked the wind, and said to the sea, “Peace. Be still.”

The wind ceased, and there was a great calm.

He asked why they were afraid. They said to one another, “Who then is this, that even the wind and the sea obey him?”', all, true, 'free', 22, 'published'),
('feeding-the-five-thousand', 'Feeding the 5,000', 'Five loaves and two fish become enough, with baskets left over.', 'NT', 'MRK.6.34', 'MRK.6.44', 'Jesus saw a great crowd and had compassion on them, because they were like sheep without a shepherd.

When it grew late, the disciples said the place was deserted and the people should go buy food.

Jesus said, “You give them something to eat.” They asked if they should buy bread for everyone.

They found five loaves and two fish. Jesus told the people to sit down on the green grass.

He took the loaves and fish, looked up to heaven, blessed them, and broke them. The disciples set them before the people.

Everyone ate and was filled. They picked up twelve baskets of broken pieces.', kids, false, 'free', 23, 'published'),
('the-good-samaritan', 'The Good Samaritan', 'A neighbour is the one who stops and helps.', 'NT', 'LUK.10.25', 'LUK.10.37', 'A lawyer asked, “What must I do to inherit eternal life?” Jesus asked what the law said.

The man answered: love God with all your heart, and love your neighbour as yourself.

Wanting to justify himself, he asked who his neighbour was. Jesus told a story.

A man going down to Jericho was attacked and left half dead. A priest and a Levite passed by.

A Samaritan saw him, had compassion, bandaged his wounds, and took him to an inn.

Jesus asked which one was a neighbour. The lawyer said, “The one who showed mercy.” Jesus said, “Go and do the same.”', kids, false, 'free', 24, 'published'),
('the-lost-sheep', 'The Lost Sheep', 'A shepherd leaves the ninety-nine to find the one.', 'NT', 'LUK.15.1', 'LUK.15.7', 'Tax collectors and sinners drew near to hear Jesus. Some religious leaders grumbled.

Jesus asked, “Which of you, having a hundred sheep and losing one, does not leave the ninety-nine?”

The shepherd goes after the lost one until he finds it.

When he finds it, he lays it on his shoulders, rejoicing.

He calls his friends and neighbours: “Rejoice with me. I have found my sheep that was lost.”

Jesus said there is joy in heaven over one sinner who turns back.', kids, true, 'free', 25, 'published'),
('the-prodigal-son', 'The Prodigal Son', 'A son comes home, and his father runs to meet him.', 'NT', 'LUK.15.11', 'LUK.15.32', 'A man had two sons. The younger asked for his share of the property and left for a far country.

He wasted what he had. A famine came, and he ended up feeding pigs, hungry enough to eat their food.

He came to himself and said, “I will go to my father and say I have sinned.”

While he was still far off, his father saw him, ran, embraced him, and kissed him.

The father called for the best robe, a ring, and sandals, and a feast: “This son of mine was lost and is found.”

The older son was angry. The father said, “You are always with me. It was right to celebrate.”', all, true, 'free', 26, 'published'),
('zacchaeus', 'Zacchaeus', 'A short man climbs a tree and comes down to welcome Jesus home.', 'NT', 'LUK.19.1', 'LUK.19.10', 'Jesus entered Jericho and was passing through.

Zacchaeus, a chief tax collector, was short and could not see, so he climbed a sycamore tree.

Jesus looked up and said, “Zacchaeus, hurry and come down. I must stay at your house today.”

He hurried down and welcomed Jesus joyfully.

People grumbled that Jesus had gone to be the guest of a sinner.

Zacchaeus said he would give half his goods to the poor and repay four times anyone he had cheated. Jesus said salvation had come to that house.', kids, false, 'free', 27, 'published'),
('the-last-supper', 'The Last Supper', 'Jesus shares bread and a cup and speaks of a new covenant.', 'NT', 'LUK.22.14', 'LUK.22.20', 'The disciples prepared the Passover. When the hour came, Jesus sat down with them.

He said, “I have earnestly desired to eat this Passover with you before I suffer.”

He took bread, gave thanks, broke it, and gave it to them, saying, “This is my body, given for you.”

He told them to do this in remembrance of him.

After supper he took the cup and said it was the new covenant in his blood, poured out for them.

They were at the table with him. The night was quiet, and the words were meant to be kept.', all, false, 'free', 28, 'published'),
('the-resurrection', 'The Resurrection', 'At dawn the tomb is open, and the women are told he is risen.', 'NT', 'LUK.24.1', 'LUK.24.12', 'On the first day of the week, at early dawn, the women came to the tomb with spices.

They found the stone rolled away from the tomb.

They went in and did not find the body. Two men in dazzling clothes stood by them.

The men said, “Why do you look for the living among the dead? He is not here. He is risen.”

The women remembered Jesus’ words and returned from the tomb.

They told the eleven and the rest. The words seemed like an idle tale, but Peter ran to the tomb.', all, false, 'free', 29, 'published'),
('pentecost', 'Pentecost', 'A wind, tongues of fire, and a message everyone can hear.', 'NT', 'ACT.2.1', 'ACT.2.21', 'When the day of Pentecost came, they were all together in one place.

Suddenly a sound like a mighty rushing wind filled the house.

Tongues like fire rested on each of them.

They were filled with the Holy Spirit and began to speak in other languages.

People from many nations heard them speaking about God’s works in their own languages.

Peter stood up and explained that this was what the prophet Joel had spoken about: God pouring out his Spirit.', all, false, 'free', 30, 'published')
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  age_band = excluded.age_band,
  is_bedtime = excluded.is_bedtime,
  review_status = excluded.review_status;

insert into public.scenes (story_id, order_index, verse_ref, caption, narration, review_status)
select s.id, x.ord, x.ref, x.caption, x.narration, 'published'::public.review_status
from public.stories s
join (values
('creation', 1, 'GEN.1.1', 'A beginning', 'In the beginning God created the heavens and the earth. The earth was empty and dark, and the Spirit of God moved over the waters.', 'published'),
('creation', 2, 'GEN.1.3', 'Light', 'God said, “Let there be light,” and there was light. He called the light day and the darkness night.', 'published'),
('creation', 3, 'GEN.1.9', 'Sky and land', 'God gathered the waters so dry land could appear, and he called the land earth. Then the earth brought out grass and trees with seed.', 'published'),
('creation', 4, 'GEN.1.14', 'Lights in the sky', 'God set lights in the sky to mark days and seasons, a greater light for the day and a lesser light for the night.', 'published'),
('creation', 5, 'GEN.1.20', 'Living creatures', 'The waters filled with living creatures, birds flew, and animals walked on the land, each of its kind. God saw that it was good.', 'published'),
('creation', 6, 'GEN.1.26', 'People, and rest', 'God made people in his image and blessed them. On the seventh day he rested from the work he had done.', 'published'),
('adam-and-eve', 1, 'GEN.2.7', 'Formed from the ground', 'God formed a man from the dust and breathed into him, and the man became a living person.', 'published'),
('adam-and-eve', 2, 'GEN.2.8', 'The garden', 'God planted a garden in Eden and put the man there to work it and take care of it. A river watered the garden.', 'published'),
('adam-and-eve', 3, 'GEN.2.18', 'A helper', 'None of the animals was the partner the man needed. God made a woman, and the man welcomed her.', 'published'),
('adam-and-eve', 4, 'GEN.3.1', 'The question', 'The serpent asked about the one tree God had forbidden. The woman and the man both ate its fruit.', 'published'),
('adam-and-eve', 5, 'GEN.3.8', 'Hiding', 'They heard God walking in the garden and hid. God called, “Where are you?”', 'published'),
('adam-and-eve', 6, 'GEN.3.21', 'Leaving the garden', 'God clothed them and sent them out of the garden. The way back was guarded.', 'published'),
('noah', 1, 'GEN.6.9', 'A good man', 'Noah walked with God while the earth was full of violence. God told him to build an ark.', 'published'),
('noah', 2, 'GEN.7.1', 'Two by two', 'Noah’s family and the animals went into the ark, as God had said.', 'published'),
('noah', 3, 'GEN.7.17', 'The rain', 'Rain fell for forty days. The waters rose, and the ark floated above them.', 'published'),
('noah', 4, 'GEN.8.8', 'A dove', 'When the waters went down, Noah sent out a dove. It returned with an olive leaf.', 'published'),
('noah', 5, 'GEN.8.15', 'Dry ground', 'God told Noah to come out. Noah built an altar and thanked God.', 'published'),
('noah', 6, 'GEN.9.12', 'The bow', 'God promised not to flood the whole earth again, and set a rainbow as the sign.', 'published'),
('tower-of-babel', 1, 'GEN.11.1', 'One language', 'The whole earth used the same words. As people moved east they found a plain.', 'published'),
('tower-of-babel', 2, 'GEN.11.3', 'Brick and tar', 'They said, “Let’s make bricks,” and they used tar for mortar.', 'published'),
('tower-of-babel', 3, 'GEN.11.4', 'A tower', 'They planned a city and a tower that would reach the sky, so they would not be scattered.', 'published'),
('tower-of-babel', 4, 'GEN.11.5', 'God comes down', 'God saw the city and the tower they were building.', 'published'),
('tower-of-babel', 5, 'GEN.11.7', 'Confused words', 'God confused their language so they could not understand one another.', 'published'),
('tower-of-babel', 6, 'GEN.11.8', 'Scattered', 'They stopped building and spread over the earth. The place was called Babel.', 'published'),
('abrahams-promise', 1, 'GEN.12.1', 'Go', 'God said to Abram, “Leave your country and your father’s house. I will show you a land.”', 'published'),
('abrahams-promise', 2, 'GEN.12.2', 'A blessing', 'God said he would make Abram a great nation and that all families of the earth would be blessed in him.', 'published'),
('abrahams-promise', 3, 'GEN.12.4', 'The journey', 'Abram went, as God had told him, and Lot went with him. Abram was seventy-five.', 'published'),
('abrahams-promise', 4, 'GEN.12.7', 'The land', 'Abram travelled through the land. God said, “I will give this land to your offspring.”', 'published'),
('abrahams-promise', 5, 'GEN.15.5', 'Look at the stars', 'Later God brought Abram outside and said, “Count the stars, if you can. So shall your offspring be.”', 'published'),
('abrahams-promise', 6, 'GEN.15.6', 'He trusted', 'Abram believed God, and God counted that faith as righteousness.', 'published'),
('joseph', 1, 'GEN.37.3', 'The coat', 'Israel loved Joseph and gave him a special coat. Joseph’s brothers hated him for it.', 'published'),
('joseph', 2, 'GEN.37.23', 'The pit', 'The brothers threw Joseph into a pit and sold him. They told their father a wild animal had taken him.', 'published'),
('joseph', 3, 'GEN.39.2', 'Egypt', 'Joseph was taken to Egypt. God was with him, even in a prison he did not deserve.', 'published'),
('joseph', 4, 'GEN.41.25', 'Dreams explained', 'God helped Joseph explain Pharaoh’s dreams: seven good years, then seven years of hunger.', 'published'),
('joseph', 5, 'GEN.41.41', 'Second in the land', 'Pharaoh put Joseph in charge of storing grain so Egypt, and others, could live.', 'published'),
('joseph', 6, 'GEN.45.4', 'His brothers', 'When the brothers came for food, Joseph told them who he was. “God sent me ahead of you to save lives.”', 'published'),
('baby-moses', 1, 'EXO.2.1', 'A dangerous time', 'A man and woman from Levi had a son. They saw he was a fine child and hid him for three months.', 'published'),
('baby-moses', 2, 'EXO.2.3', 'The basket', 'When they could hide him no longer, his mother made a basket of reeds and set it in the reeds by the river.', 'published'),
('baby-moses', 3, 'EXO.2.4', 'His sister watches', 'The baby’s sister stood at a distance to see what would happen to him.', 'published'),
('baby-moses', 4, 'EXO.2.5', 'The princess', 'Pharaoh’s daughter came to bathe and saw the basket. She opened it, and the baby was crying.', 'published'),
('baby-moses', 5, 'EXO.2.7', 'A nurse', 'The sister offered to find a Hebrew woman to nurse him. The princess agreed, and his own mother cared for him.', 'published'),
('baby-moses', 6, 'EXO.2.10', 'Moses', 'When the child grew, he was brought to Pharaoh’s daughter, and she named him Moses, because she drew him out of the water.', 'published'),
('the-exodus', 1, 'EXO.14.10', 'Trapped', 'Pharaoh’s army came near, and the people were afraid. They cried out to God.', 'published'),
('the-exodus', 2, 'EXO.14.13', 'Stand still', 'Moses said, “Don’t be afraid. Stand still, and see the salvation of God.”', 'published'),
('the-exodus', 3, 'EXO.14.15', 'Go forward', 'God told Moses to lift his staff and stretch his hand over the sea, and to tell the people to go forward.', 'published'),
('the-exodus', 4, 'EXO.14.21', 'A wall of water', 'God drove the sea back with a strong wind. The waters were a wall on the right and on the left.', 'published'),
('the-exodus', 5, 'EXO.14.22', 'Dry ground', 'The people of Israel walked through the sea on dry ground.', 'published'),
('the-exodus', 6, 'EXO.14.31', 'They believed', 'When they saw what God had done, the people feared God and believed him and his servant Moses.', 'published'),
('ten-commandments', 1, 'EXO.20.1', 'God speaks', 'God spoke all these words: “I am the LORD your God, who brought you out of Egypt.”', 'published'),
('ten-commandments', 2, 'EXO.20.3', 'Only God', 'You shall have no other gods. You shall not make an idol or misuse God’s name.', 'published'),
('ten-commandments', 3, 'EXO.20.8', 'The sabbath', 'Remember the sabbath day and keep it holy. Six days you work, and the seventh is a rest.', 'published'),
('ten-commandments', 4, 'EXO.20.12', 'Parents', 'Honour your father and your mother, so that you may live long in the land.', 'published'),
('ten-commandments', 5, 'EXO.20.13', 'Your neighbour', 'Do not murder, do not commit adultery, do not steal, and do not lie about your neighbour.', 'published'),
('ten-commandments', 6, 'EXO.20.17', 'The heart', 'Do not covet anything that belongs to your neighbour.', 'published'),
('joshua-and-jericho', 1, 'JOS.6.1', 'Shut tight', 'Jericho was shut up. No one went out and no one came in.', 'published'),
('joshua-and-jericho', 2, 'JOS.6.2', 'The plan', 'God told Joshua that the city was given to him, and told the people how to march.', 'published'),
('joshua-and-jericho', 3, 'JOS.6.4', 'Seven priests', 'Seven priests carried rams’ horns before the ark, and the armed men walked ahead.', 'published'),
('joshua-and-jericho', 4, 'JOS.6.14', 'Six quiet days', 'For six days they marched around the city once and returned to camp.', 'published'),
('joshua-and-jericho', 5, 'JOS.6.16', 'The seventh day', 'On the seventh day they marched seven times. Joshua said, “Shout, for God has given you the city.”', 'published'),
('joshua-and-jericho', 6, 'JOS.6.20', 'The wall', 'The people shouted, the horns sounded, and the wall fell down flat.', 'published'),
('ruth', 1, 'RUT.1.14', 'Stay or go', 'Naomi urged her daughters-in-law to return to their own mothers. Orpah kissed her, but Ruth clung to her.', 'published'),
('ruth', 2, 'RUT.1.16', 'Where you go', 'Ruth said, “Where you go, I will go. Your people will be my people, and your God my God.”', 'published'),
('ruth', 3, 'RUT.2.2', 'The field', 'Ruth gleaned in the field of Boaz, a relative of Naomi’s husband.', 'published'),
('ruth', 4, 'RUT.2.8', 'Kindness', 'Boaz told her to stay in his field and made sure she was safe and fed.', 'published'),
('ruth', 5, 'RUT.3.1', 'A redeemer', 'Naomi sent Ruth to ask Boaz to act as the family redeemer.', 'published'),
('ruth', 6, 'RUT.4.13', 'A son', 'Boaz married Ruth. They had a son, and the women said God had not left Naomi without a redeemer.', 'published'),
('samuel-hears-god', 1, '1SA.3.1', 'The lamp', 'The boy Samuel served God under Eli. The word of God was rare in those days, and the lamp had not yet gone out.', 'published'),
('samuel-hears-god', 2, '1SA.3.4', 'Samuel', 'God called, “Samuel.” Samuel ran to Eli and said, “Here I am.”', 'published'),
('samuel-hears-god', 3, '1SA.3.6', 'Not Eli', 'Eli said he had not called. This happened three times.', 'published'),
('samuel-hears-god', 4, '1SA.3.8', 'Eli understands', 'Eli realised God was calling the boy. He told Samuel what to say.', 'published'),
('samuel-hears-god', 5, '1SA.3.10', 'Listening', 'Samuel went back and lay down. God came and called as before.', 'published'),
('samuel-hears-god', 6, '1SA.3.10', 'Speak', 'Samuel answered, “Speak, for your servant is listening.”', 'published'),
('david-and-goliath', 1, '1SA.17.4', 'The champion', 'A champion named Goliath came out from the Philistine camp. He was very tall, and he taunted Israel.', 'published'),
('david-and-goliath', 2, '1SA.17.16', 'Forty days', 'Every morning and evening Goliath took his stand. Saul and Israel were dismayed.', 'published'),
('david-and-goliath', 3, '1SA.17.20', 'David arrives', 'David had come to bring food to his brothers. He heard the taunt and asked what it meant.', 'published'),
('david-and-goliath', 4, '1SA.17.34', 'I will go', 'David said he had protected his sheep from lion and bear, and he would face this Philistine too.', 'published'),
('david-and-goliath', 5, '1SA.17.40', 'Five stones', 'He took his staff, five smooth stones, and his sling. He refused Saul’s armour.', 'published'),
('david-and-goliath', 6, '1SA.17.45', 'In the name of God', 'David said he came in the name of the LORD. The stone struck Goliath, and the giant fell.', 'published'),
('solomons-wisdom', 1, '1KI.3.5', 'Ask', 'At Gibeon, God said to Solomon in a dream, “Ask what I should give you.”', 'published'),
('solomons-wisdom', 2, '1KI.3.9', 'A listening heart', 'Solomon asked for an understanding heart to judge God’s people, not for long life or riches.', 'published'),
('solomons-wisdom', 3, '1KI.3.10', 'The gift', 'God was pleased and gave him a wise and discerning heart, and also what he had not asked.', 'published'),
('solomons-wisdom', 4, '1KI.3.16', 'Two mothers', 'Two women came, each saying the living child was hers.', 'published'),
('solomons-wisdom', 5, '1KI.3.24', 'The test', 'Solomon said, “Bring a sword.” He suggested dividing the child, to see who would refuse.', 'published'),
('solomons-wisdom', 6, '1KI.3.26', 'The true mother', 'The real mother begged him to give the child to the other woman. Solomon gave the boy to her.', 'published'),
('elijah', 1, '1KI.18.21', 'The contest', 'Elijah met the prophets of Baal on Mount Carmel and said the people must choose whom they would serve.', 'published'),
('elijah', 2, '1KI.18.26', 'No answer', 'The prophets of Baal called all day. There was no voice and no answer.', 'published'),
('elijah', 3, '1KI.18.30', 'The altar', 'Elijah repaired the altar of the LORD, laid the offering on it, and had water poured over it.', 'published'),
('elijah', 4, '1KI.18.38', 'Fire', 'Elijah prayed, and the fire of God fell and consumed the offering.', 'published'),
('elijah', 5, '1KI.19.4', 'Under the broom tree', 'Later Elijah fled, sat under a broom tree, and asked to die. An angel fed him.', 'published'),
('elijah', 6, '1KI.19.11', 'A still small voice', 'On the mountain, God was not in the wind, the earthquake, or the fire. Then came a low whisper.', 'published'),
('daniel', 1, 'DAN.6.7', 'The law', 'Officials tricked the king into a law: for thirty days, pray only to the king, or be thrown to the lions.', 'published'),
('daniel', 2, 'DAN.6.10', 'The window', 'Daniel went home, knelt at his open window toward Jerusalem, and prayed as he always had.', 'published'),
('daniel', 3, 'DAN.6.11', 'Caught', 'The officials found him praying and told the king.', 'published'),
('daniel', 4, 'DAN.6.16', 'The den', 'The king was distressed, but the law stood. Daniel was put into the lions’ den.', 'published'),
('daniel', 5, 'DAN.6.19', 'At dawn', 'At first light the king hurried to the den and called out in anguish.', 'published'),
('daniel', 6, 'DAN.6.21', 'Safe', 'Daniel answered, “My God sent his angel and shut the lions’ mouths.” The king was overjoyed.', 'published'),
('jonah', 1, 'JON.1.1', 'The wrong direction', 'God told Jonah to go to Nineveh. Jonah boarded a ship for Tarshish instead.', 'published'),
('jonah', 2, 'JON.1.4', 'The storm', 'God sent a great wind. The sailors were afraid, and Jonah was asleep below.', 'published'),
('jonah', 3, 'JON.1.15', 'Into the sea', 'Jonah said the storm was because of him. They threw him into the sea, and it grew calm.', 'published'),
('jonah', 4, 'JON.1.17', 'The fish', 'God provided a great fish to swallow Jonah. Jonah was in the fish three days and three nights.', 'published'),
('jonah', 5, 'JON.3.1', 'Nineveh', 'The fish put him on dry land. Jonah went to Nineveh and warned the city.', 'published'),
('jonah', 6, 'JON.3.5', 'They turned', 'The people of Nineveh believed God and turned from their violence. God relented.', 'published'),
('esther', 1, 'EST.4.1', 'A decree', 'A decree went out against the Jewish people. Mordecai tore his clothes and mourned.', 'published'),
('esther', 2, 'EST.4.14', 'For such a time', 'Mordecai told Esther, “Who knows whether you have come to the kingdom for such a time as this?”', 'published'),
('esther', 3, 'EST.4.16', 'If I perish', 'Esther asked her people to fast. Then she said, “I will go to the king, and if I perish, I perish.”', 'published'),
('esther', 4, 'EST.5.1', 'The golden sceptre', 'She stood in the inner court. The king held out the golden sceptre, and she lived.', 'published'),
('esther', 5, 'EST.5.4', 'A banquet', 'Esther invited the king and Haman to a banquet, and then to another.', 'published'),
('esther', 6, 'EST.7.3', 'The request', 'At the second banquet she asked for her life and her people’s life, and named the man who threatened them.', 'published'),
('the-nativity', 1, 'LUK.2.1', 'The journey', 'Caesar’s decree sent everyone to their own town. Joseph went to Bethlehem with Mary, who was expecting a child.', 'published'),
('the-nativity', 2, 'LUK.2.6', 'No room', 'While they were there, the time came for the baby to be born. She laid him in a manger, because there was no room.', 'published'),
('the-nativity', 3, 'LUK.2.8', 'Shepherds', 'Shepherds were staying in the fields, keeping watch over their flock by night.', 'published'),
('the-nativity', 4, 'LUK.2.10', 'Good news', 'An angel said, “Don’t be afraid. I bring good news of great joy. A Saviour is born.”', 'published'),
('the-nativity', 5, 'LUK.2.13', 'The song', 'A crowd of angels praised God: “Glory to God in the highest, and on earth peace.”', 'published'),
('the-nativity', 6, 'LUK.2.15', 'They went', 'The shepherds hurried to Bethlehem, found the baby, and told what they had heard.', 'published'),
('boy-jesus', 1, 'LUK.2.41', 'The festival', 'Every year Jesus’ parents went to Jerusalem for the Passover.', 'published'),
('boy-jesus', 2, 'LUK.2.43', 'Left behind', 'When he was twelve they went as usual. On the way home they realised he was not with the group.', 'published'),
('boy-jesus', 3, 'LUK.2.46', 'Three days', 'They searched and found him in the temple, sitting among the teachers.', 'published'),
('boy-jesus', 4, 'LUK.2.46', 'Listening', 'He was listening to them and asking questions. Everyone who heard him was amazed.', 'published'),
('boy-jesus', 5, 'LUK.2.48', 'Why?', 'His mother said they had been anxiously searching. He asked, “Didn’t you know I must be in my Father’s house?”', 'published'),
('boy-jesus', 6, 'LUK.2.51', 'Home', 'He went back to Nazareth with them and was obedient. Jesus grew in wisdom and stature.', 'published'),
('jesus-baptism', 1, 'MAT.3.1', 'John', 'John the Baptist was in the wilderness, calling people to turn and be baptised.', 'published'),
('jesus-baptism', 2, 'MAT.3.11', 'Prepare', 'He said someone greater was coming, whose sandals he was not worthy to carry.', 'published'),
('jesus-baptism', 3, 'MAT.3.13', 'Jesus comes', 'Jesus came from Galilee to the Jordan to be baptised by John.', 'published'),
('jesus-baptism', 4, 'MAT.3.14', 'John hesitates', 'John tried to stop him and said, “I need to be baptised by you.”', 'published'),
('jesus-baptism', 5, 'MAT.3.15', 'The river', 'Jesus answered that it was right to fulfil all righteousness. Then John baptised him.', 'published'),
('jesus-baptism', 6, 'MAT.3.16', 'Beloved', 'The Spirit descended like a dove, and a voice said, “This is my beloved Son, with whom I am well pleased.”', 'published'),
('calming-the-storm', 1, 'MRK.4.35', 'Evening', 'When evening came, Jesus said to his disciples, “Let’s go over to the other side.”', 'published'),
('calming-the-storm', 2, 'MRK.4.37', 'Asleep', 'A great windstorm rose. Waves beat into the boat. Jesus was in the stern, asleep on a cushion.', 'published'),
('calming-the-storm', 3, 'MRK.4.38', 'Teacher', 'They woke him and said, “Teacher, don’t you care that we are dying?”', 'published'),
('calming-the-storm', 4, 'MRK.4.39', 'Peace', 'He awoke, rebuked the wind, and said to the sea, “Peace. Be still.”', 'published'),
('calming-the-storm', 5, 'MRK.4.39', 'A calm', 'The wind ceased, and there was a great calm.', 'published'),
('calming-the-storm', 6, 'MRK.4.40', 'Who is this?', 'He asked why they were afraid. They said to one another, “Who then is this, that even the wind and the sea obey him?”', 'published'),
('feeding-the-five-thousand', 1, 'MRK.6.34', 'A crowd', 'Jesus saw a great crowd and had compassion on them, because they were like sheep without a shepherd.', 'published'),
('feeding-the-five-thousand', 2, 'MRK.6.35', 'Late', 'When it grew late, the disciples said the place was deserted and the people should go buy food.', 'published'),
('feeding-the-five-thousand', 3, 'MRK.6.37', 'You give them something', 'Jesus said, “You give them something to eat.” They asked if they should buy bread for everyone.', 'published'),
('feeding-the-five-thousand', 4, 'MRK.6.38', 'Five and two', 'They found five loaves and two fish. Jesus told the people to sit down on the green grass.', 'published'),
('feeding-the-five-thousand', 5, 'MRK.6.41', 'He blessed', 'He took the loaves and fish, looked up to heaven, blessed them, and broke them. The disciples set them before the people.', 'published'),
('feeding-the-five-thousand', 6, 'MRK.6.42', 'Twelve baskets', 'Everyone ate and was filled. They picked up twelve baskets of broken pieces.', 'published'),
('the-good-samaritan', 1, 'LUK.10.25', 'A question', 'A lawyer asked, “What must I do to inherit eternal life?” Jesus asked what the law said.', 'published'),
('the-good-samaritan', 2, 'LUK.10.27', 'Love', 'The man answered: love God with all your heart, and love your neighbour as yourself.', 'published'),
('the-good-samaritan', 3, 'LUK.10.29', 'Who is my neighbour?', 'Wanting to justify himself, he asked who his neighbour was. Jesus told a story.', 'published'),
('the-good-samaritan', 4, 'LUK.10.30', 'The road', 'A man going down to Jericho was attacked and left half dead. A priest and a Levite passed by.', 'published'),
('the-good-samaritan', 5, 'LUK.10.33', 'He stopped', 'A Samaritan saw him, had compassion, bandaged his wounds, and took him to an inn.', 'published'),
('the-good-samaritan', 6, 'LUK.10.36', 'Go and do likewise', 'Jesus asked which one was a neighbour. The lawyer said, “The one who showed mercy.” Jesus said, “Go and do the same.”', 'published'),
('the-lost-sheep', 1, 'LUK.15.1', 'The listeners', 'Tax collectors and sinners drew near to hear Jesus. Some religious leaders grumbled.', 'published'),
('the-lost-sheep', 2, 'LUK.15.4', 'A hundred sheep', 'Jesus asked, “Which of you, having a hundred sheep and losing one, does not leave the ninety-nine?”', 'published'),
('the-lost-sheep', 3, 'LUK.15.4', 'The search', 'The shepherd goes after the lost one until he finds it.', 'published'),
('the-lost-sheep', 4, 'LUK.15.5', 'On his shoulders', 'When he finds it, he lays it on his shoulders, rejoicing.', 'published'),
('the-lost-sheep', 5, 'LUK.15.6', 'Come and rejoice', 'He calls his friends and neighbours: “Rejoice with me. I have found my sheep that was lost.”', 'published'),
('the-lost-sheep', 6, 'LUK.15.7', 'Heaven', 'Jesus said there is joy in heaven over one sinner who turns back.', 'published'),
('the-prodigal-son', 1, 'LUK.15.11', 'The request', 'A man had two sons. The younger asked for his share of the property and left for a far country.', 'published'),
('the-prodigal-son', 2, 'LUK.15.13', 'Empty', 'He wasted what he had. A famine came, and he ended up feeding pigs, hungry enough to eat their food.', 'published'),
('the-prodigal-son', 3, 'LUK.15.17', 'I will go home', 'He came to himself and said, “I will go to my father and say I have sinned.”', 'published'),
('the-prodigal-son', 4, 'LUK.15.20', 'The father runs', 'While he was still far off, his father saw him, ran, embraced him, and kissed him.', 'published'),
('the-prodigal-son', 5, 'LUK.15.22', 'The robe', 'The father called for the best robe, a ring, and sandals, and a feast: “This son of mine was lost and is found.”', 'published'),
('the-prodigal-son', 6, 'LUK.15.28', 'The older brother', 'The older son was angry. The father said, “You are always with me. It was right to celebrate.”', 'published'),
('zacchaeus', 1, 'LUK.19.1', 'Jericho', 'Jesus entered Jericho and was passing through.', 'published'),
('zacchaeus', 2, 'LUK.19.2', 'The tree', 'Zacchaeus, a chief tax collector, was short and could not see, so he climbed a sycamore tree.', 'published'),
('zacchaeus', 3, 'LUK.19.5', 'Come down', 'Jesus looked up and said, “Zacchaeus, hurry and come down. I must stay at your house today.”', 'published'),
('zacchaeus', 4, 'LUK.19.6', 'Joy', 'He hurried down and welcomed Jesus joyfully.', 'published'),
('zacchaeus', 5, 'LUK.19.7', 'Grumbling', 'People grumbled that Jesus had gone to be the guest of a sinner.', 'published'),
('zacchaeus', 6, 'LUK.19.8', 'Half of what I have', 'Zacchaeus said he would give half his goods to the poor and repay four times anyone he had cheated. Jesus said salvation had come to that house.', 'published'),
('the-last-supper', 1, 'LUK.22.14', 'The room', 'The disciples prepared the Passover. When the hour came, Jesus sat down with them.', 'published'),
('the-last-supper', 2, 'LUK.22.15', 'I have desired', 'He said, “I have earnestly desired to eat this Passover with you before I suffer.”', 'published'),
('the-last-supper', 3, 'LUK.22.19', 'The bread', 'He took bread, gave thanks, broke it, and gave it to them, saying, “This is my body, given for you.”', 'published'),
('the-last-supper', 4, 'LUK.22.19', 'Remember', 'He told them to do this in remembrance of him.', 'published'),
('the-last-supper', 5, 'LUK.22.20', 'The cup', 'After supper he took the cup and said it was the new covenant in his blood, poured out for them.', 'published'),
('the-last-supper', 6, 'LUK.22.14', 'Together', 'They were at the table with him. The night was quiet, and the words were meant to be kept.', 'published'),
('the-resurrection', 1, 'LUK.24.1', 'Early', 'On the first day of the week, at early dawn, the women came to the tomb with spices.', 'published'),
('the-resurrection', 2, 'LUK.24.2', 'The stone', 'They found the stone rolled away from the tomb.', 'published'),
('the-resurrection', 3, 'LUK.24.3', 'He is not here', 'They went in and did not find the body. Two men in dazzling clothes stood by them.', 'published'),
('the-resurrection', 4, 'LUK.24.5', 'Remember', 'The men said, “Why do you look for the living among the dead? He is not here. He is risen.”', 'published'),
('the-resurrection', 5, 'LUK.24.8', 'They remembered', 'The women remembered Jesus’ words and returned from the tomb.', 'published'),
('the-resurrection', 6, 'LUK.24.9', 'They told the others', 'They told the eleven and the rest. The words seemed like an idle tale, but Peter ran to the tomb.', 'published'),
('pentecost', 1, 'ACT.2.1', 'Together', 'When the day of Pentecost came, they were all together in one place.', 'published'),
('pentecost', 2, 'ACT.2.2', 'A rushing wind', 'Suddenly a sound like a mighty rushing wind filled the house.', 'published'),
('pentecost', 3, 'ACT.2.3', 'Fire', 'Tongues like fire rested on each of them.', 'published'),
('pentecost', 4, 'ACT.2.4', 'Other languages', 'They were filled with the Holy Spirit and began to speak in other languages.', 'published'),
('pentecost', 5, 'ACT.2.6', 'The crowd', 'People from many nations heard them speaking about God’s works in their own languages.', 'published'),
('pentecost', 6, 'ACT.2.14', 'Peter', 'Peter stood up and explained that this was what the prophet Joel had spoken about: God pouring out his Spirit.', 'published')
) as x(slug, ord, ref, caption, narration) on s.slug = x.slug
on conflict (story_id, order_index) do update set
  verse_ref = excluded.verse_ref,
  caption = excluded.caption,
  narration = excluded.narration,
  review_status = excluded.review_status;

insert into public.media_assets (owner_type, owner_id, kind, style, storage_bucket, storage_path, is_placeholder, tier_required, feature_flag, review_status)
select 'scene', sc.id::text, 'image', 'none', 'media-public', 'placeholders/scene-' || s.slug || '-' || sc.order_index || '.svg', true, 'free', 'scene_images', 'published'
from public.scenes sc
join public.stories s on s.id = sc.story_id
where not exists (
  select 1 from public.media_assets m
  where m.storage_path = 'placeholders/scene-' || s.slug || '-' || sc.order_index || '.svg'
);

insert into public.media_assets (owner_type, owner_id, kind, style, storage_bucket, storage_path, is_placeholder, tier_required, feature_flag, review_status)
select 'story', s.id::text, 'video', x.style::public.media_style, 'media-private', x.path, true, 'premium', 'video_mode', 'published'
from (values
('creation', 'human', 'placeholders/video-creation-human.mp4'),
('creation', 'anime', 'placeholders/video-creation-anime.mp4'),
('the-nativity', 'human', 'placeholders/video-the-nativity-human.mp4'),
('the-nativity', 'anime', 'placeholders/video-the-nativity-anime.mp4'),
('david-and-goliath', 'human', 'placeholders/video-david-and-goliath-human.mp4'),
('david-and-goliath', 'anime', 'placeholders/video-david-and-goliath-anime.mp4'),
('the-exodus', 'human', 'placeholders/video-the-exodus-human.mp4'),
('the-exodus', 'anime', 'placeholders/video-the-exodus-anime.mp4'),
('the-resurrection', 'human', 'placeholders/video-the-resurrection-human.mp4'),
('the-resurrection', 'anime', 'placeholders/video-the-resurrection-anime.mp4')
) as x(slug, style, path)
join public.stories s on s.slug = x.slug
where not exists (select 1 from public.media_assets m where m.storage_path = x.path);
