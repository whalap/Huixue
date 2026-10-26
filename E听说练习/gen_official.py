# -*- coding: utf-8 -*-
"""把《听说考试全真模拟 1（广州专用）》完整录入 data.js 的 official 字段。
内容严格按原卷录入；听力原文/答案均来自原卷。个别原卷疑误处在代码注释中标注。"""
import io, json

OFFICIAL = {
  "title": "官方全真模拟",
  "desc": "广州中考英语人机对话真题卷 · 含听力原文与官方分层次答案",
  "papers": [
    {
      "id": "gz1",
      "name": "听说考试全真模拟 1（广州专用）",
      "desc": "五大题型完整一套 · 满分 30 分 · 含听力原文与官方分层次答案",
      "items": [
        # ============ 一、模仿朗读（6 分） ============
        {"type": "readaloud", "label": "一、模仿朗读", "score": "6 分",
         "task": {"id": "of_ra_01", "prep": 50, "rec": 60,
          "text": "Tom the cat and Jerry the mouse are two of the most popular cartoon characters in the world. In the short cartoons, Tom is always trying to catch Jerry, but he never has any success. Almost every cartoon ends with Tom in trouble and Jerry laughing at him. The stories are fun and full of laughs. William Hanna and Joseph Barbera both worked for MGM in the late 1930s. Their boss told them to make funny cartoons. Together they thought of the idea of a cat and a mouse. They thought it would be funny if the mouse was clever and always got the cat into trouble."}},  # 原卷此处经用户核对订正为 full of laughs（旧录 full of a long history 不通）

        # ============ 二、信息获取 · 第一节 听选信息（第1段，3 分） ============
        {"type": "listenchoose", "label": "二、信息获取 · 听选信息（第 1 段：书展对话）", "score": "3 分",
         "task": {"id": "of_lc_01",
          "note": "听三段对话或独白，每段播放两遍。各段播放前有 10 秒钟的读题时间。各段播放后有两个问题，请根据所听到的问题和括号内的提示，选择正确的信息在 8 秒钟内口头回答。",
          "script": "M: Hi, Lily, our school is going to hold a book fair next month. Do you have any plans?\nW: I want to take part in it! I have many storybooks to sell.\nM: That's great! I plan to help organize the fair. I need to make posters to promote it.\nW: I can help you design the posters. My sister is good at drawing, and she can join too.\nM: Perfect! Also, we need to arrange the bookshelves. Can you come to school this Sunday to help?\nW: Sure! Let's meet at 9 a.m. at the school gate.",
          "dialogue": [
            {"s": "A", "t": "Hi, Lily, our school is going to hold a book fair next month. Do you have any plans?"},
            {"s": "B", "t": "I want to take part in it! I have many storybooks to sell."},
            {"s": "A", "t": "That's great! I plan to help organize the fair. I need to make posters to promote it."},
            {"s": "B", "t": "I can help you design the posters. My sister is good at drawing, and she can join too."},
            {"s": "A", "t": "Perfect! Also, we need to arrange the bookshelves. Can you come to school this Sunday to help?"},
            {"s": "B", "t": "Sure! Let's meet at 9 a.m. at the school gate."}],
          "questions": [
            {"q": "What does the boy plan to do for the book fair?",
             "opts": ["He plans to sell storybooks.", "He plans to make promotion posters.", "He plans to arrange bookshelves."], "ans": 1},
            {"q": "When will the girl and the boy meet to prepare for the book fair?",
             "opts": ["At 9 a.m. this Saturday.", "At 10 a.m. this Sunday.", "At 9 a.m. this Sunday."], "ans": 2}]}},

        # ============ 二、信息获取 · 第一节 听选信息（第2段独白，3 分） ============
        {"type": "listenchoose", "label": "二、信息获取 · 听选信息（第 2 段：农场独白）", "score": "3 分",
         "task": {"id": "of_lc_02",
          "note": "听第二段独白，回答第 3 至第 4 两个小题。",
          "script": "I'm Tom. Last weekend, I went on a school trip to a farm with my classmates. The farm is about two hours' drive from our school. When we arrived, the farmer showed us around first. We saw many cows, chickens and sheep. Then, we learned to milk cows and collect eggs. In the afternoon, we helped the farmer pick apples. They were big and sweet. We also had a picnic on the grass. Everyone had a great time and felt tired but happy.",
          "dialogue": [
            {"s": "A", "t": "I'm Tom. Last weekend, I went on a school trip to a farm with my classmates."},
            {"s": "A", "t": "The farm is about two hours' drive from our school."},
            {"s": "A", "t": "When we arrived, the farmer showed us around first. We saw many cows, chickens and sheep."},
            {"s": "A", "t": "Then, we learned to milk cows and collect eggs."},
            {"s": "A", "t": "In the afternoon, we helped the farmer pick apples. They were big and sweet."},
            {"s": "A", "t": "We also had a picnic on the grass. Everyone had a great time and felt tired but happy."}],
          "questions": [
            {"q": "How long does it take to drive from Tom's school to the farm?",
             "opts": ["About one hour.", "About two hours.", "About three hours."], "ans": 1},
            {"q": "What did Tom and his classmates do in the afternoon on the farm?",
             "opts": ["They milked cows.", "They picked apples.", "They collected eggs."], "ans": 1}]}},

        # ============ 二、信息获取 · 第一节 听选信息（第3段，3 分） ============
        {"type": "listenchoose", "label": "二、信息获取 · 听选信息（第 3 段：音乐会对话）", "score": "3 分",
         "task": {"id": "of_lc_03",
          "note": "听第三段对话，回答第 5 至第 6 两个小题。",
          "script": "W: Mike, you look excited. Did you get the ticket for the concert?\nM: Yes! I bought two tickets online yesterday. The concert is on Friday evening at the city theater.\nW: Who is going to perform at the concert?\nM: My favorite singer, Elsa. She will sing many of her famous songs.\nW: Lucky you! Can I go with you? I'm also a fan of hers.\nM: Of course! Let's meet at the theater entrance at 6:30 p.m.",
          "dialogue": [
            {"s": "B", "t": "Mike, you look excited. Did you get the ticket for the concert?"},
            {"s": "A", "t": "Yes! I bought two tickets online yesterday. The concert is on Friday evening at the city theater."},
            {"s": "B", "t": "Who is going to perform at the concert?"},
            {"s": "A", "t": "My favorite singer, Elsa. She will sing many of her famous songs."},
            {"s": "B", "t": "Lucky you! Can I go with you? I'm also a fan of hers."},
            {"s": "A", "t": "Of course! Let's meet at the theater entrance at 6:30 p.m."}],
          "questions": [
            {"q": "Where will the concert be held?",
             "opts": ["At the school hall.", "At the city theater.", "At the community center."], "ans": 1},
            {"q": "Where will the girl and the boy meet?",
             "opts": ["At the theater entrance.", "At the theater exit.", "At the school gate."], "ans": 0}]}},

        # ============ 二、信息获取 · 第二节 回答问题（6 分） ============
        {"type": "listenanswer", "label": "二、信息获取 · 回答问题", "score": "6 分（4 题 × 1.5）",
         "task": {"id": "of_la_01",
          "note": "听下面一段独白，录音播放两遍。请根据所听内容回答第 7-10 四个问题。当听到「开始录音」的信号后，请在 8 秒钟内口头回答。",
          "script": "Last month, our school organized a volunteer activity at the community nursing home. We met at the school gate at 8 a.m. on Sunday and took a bus there. When we arrived, we first helped the elderly clean their rooms and fold clothes. Then, some classmates sang old songs, and others chatted with them about their childhood stories. We also brought homemade cookies and fresh fruits as gifts. The elderly were very happy, and I felt a strong sense of satisfaction. This experience made me understand the importance of caring for the elderly around us.",
          "monologue": "Last month, our school organized a volunteer activity at the community nursing home. We met at the school gate at 8 a.m. on Sunday and took a bus there. When we arrived, we first helped the elderly clean their rooms and fold clothes. Then, some classmates sang old songs, and others chatted with them about their childhood stories. We also brought homemade cookies and fresh fruits as gifts. The elderly were very happy, and I felt a strong sense of satisfaction. This experience made me understand the importance of caring for the elderly around us.",
          "questions": [
            {"q": "When did the speaker take part in the volunteer activity?"},
            {"q": "Where did the volunteer activity take place?"},
            {"q": "What did the speaker and classmates bring to the elderly?"},
            {"q": "How did the speaker feel after the volunteer activity?"}],
          # 官方答案三层次：①简短回答 ②完整短句 ③强调句（高级句型）
          "keys": [
            "Last month.",
            "At the community nursing home.",
            "They brought homemade cookies and fresh fruits.",
            "The speaker felt a strong sense of satisfaction."],
          "keysFull": [
            "The speaker took part in the volunteer activity last month.",
            "The volunteer activity took place at the community nursing home.",
            "The speaker and classmates brought homemade cookies and fresh fruits as gifts.",
            "He/She felt a strong sense of satisfaction after the activity."],
          "keysEmph": [
            "It was last month that the speaker joined the volunteer activity.",
            "It was at the community nursing home that the volunteer activity was held.",
            "Homemade cookies and fresh fruits were what they brought to the elderly.",
            "A strong sense of satisfaction was what the speaker felt."]}},

        # ============ 三、信息转述及询问 · 第一节 信息转述（6 分） ============
        {"type": "retell", "label": "三、信息转述及询问 · 信息转述", "score": "6 分",
         "task": {"id": "of_rt_01", "retPrep": 50, "retRec": 60,
          "note": "你将听到一段关于 9 年级学生周六前往城郊区参加植树活动的经历，请根据所听到的内容和提示，在 60 秒钟内复述这段经历，包含全部要点。现在你有 15 秒钟的时间阅读首句及要点提示。",
          "firstLine": "Our school held...",
          "passage": "Last week, our school held a tree-planting activity in the hills near the city. All Grade 9 students took part in it. We met at the school gate at 7:30 a.m. on Saturday and went there by school bus. Upon arrival, the teacher divided us into groups. Some dug holes, some put young trees into the holes, and others watered the trees after planting. We worked hard for three hours and planted over 200 young trees. Everyone felt tired but proud, because we helped make the environment greener.",
          "points": [
            "Our school held a tree-planting activity in the hills near the city last week",
            "All Grade 9 students took part in it",
            "They met at the school gate at 7:30 a.m. on Saturday and went there by school bus",
            "The teacher divided them into groups",
            "Some dug holes, some put young trees into the holes, others watered them",
            "They worked hard for three hours and planted over 200 young trees",
            "Everyone felt tired but proud because they helped make the environment greener"],
          "keywords": [
            ["tree-planting", "tree planting", "plant", "hills"],
            ["grade 9", "g9", "all grade", "students"],
            ["school gate", "7:30", "bus", "met"],
            ["divided", "groups", "split"],
            ["dug", "young trees", "watered", "holes"],
            ["three hours", "3 hours", "200", "worked", "planted"],
            ["tired", "proud", "greener", "environment"]],
          "sample": "Our school held a tree-planting activity in the hills near the city last week. All Grade 9 students took part in it. We met at the school gate at 7:30 a.m. on Saturday and went there by school bus. Upon arrival, the teacher divided us into groups. Some dug holes, some put young trees into the holes, and others watered the trees after planting. We worked hard for three hours and planted over 200 young trees. Everyone felt tired but proud, because we helped make the environment greener."}},

        # ============ 三、信息转述及询问 · 第二节 询问信息（3 分） ============
        {"type": "ask", "label": "三、信息转述及询问 · 询问信息", "score": "3 分（2 题 × 1.5）",
         "task": {"id": "of_ak_01",
          "note": "你希望了解更多信息，请根据以下提示提两个问题，每个问题有 15 秒钟的准备时间和 8 秒钟的提问时间。",
          "prompts": [
            {"cn": "这次植树活动是在什么地方举行的？", "en": "Where was the tree-planting activity held?"},
            {"cn": "学生们在植树活动中种了多少棵小树？", "en": "How many young trees did the students plant during the tree-planting activity?"}]}}
      ]
    }
  ]
}

if __name__ == "__main__":
    p = 'data.js'
    s = io.open(p, encoding='utf-8').read()
    body = s[s.index('{'):s.rindex('}') + 1]
    d = json.loads(body)
    d['official'] = OFFICIAL
    head = "/* 自动生成：广州中考E听说 分级题库（每题型100关，A1/A2/B1）+ 官方全真模拟真题。 */\n"
    io.open(p, 'w', encoding='utf-8').write(head + 'const SITE_DATA = ' + json.dumps(d, ensure_ascii=False, indent=2) + ';\n')

    # 校验
    s2 = io.open(p, encoding='utf-8').read()
    d2 = json.loads(s2[s2.index('{'):s2.rindex('}') + 1])
    items = d2['official']['papers'][0]['items']
    print('official 录入完成：', len(items), '个题型条目')
    for it in items:
        t = it['task']
        print(' -', it['label'], '| id=', t['id'], '| score=', it['score'])
    # 答案与原卷一致性抽查
    la = [i for i in items if i['type'] == 'listenanswer'][0]['task']
    assert len(la['keys']) == len(la['keysFull']) == len(la['keysEmph']) == 4, '三层次答案数量不一致'
    rt = [i for i in items if i['type'] == 'retell'][0]['task']
    assert len(rt['points']) == len(rt['keywords']) == 7, '转述要点/关键词不对齐'
    for i, it in enumerate(items):
        if it['type'] == 'listenchoose':
            for q in it['task']['questions']:
                assert len(q['opts']) == 3 and 0 <= q['ans'] < 3, '选项/答案索引异常: ' + it['task']['id']
    print('结构校验全部通过 ✔')
