# sw expert academy 4408 lv4 dfs
answer = 987654321

def dfs(students, visit, corridor, index, time):
    global answer

    if time > len(visit):
        return 

    checker = [True] * len(visit)
    if visit == checker:
        answer = min(answer, time)
        return 

    start_corridor = (students[index][0] - 1) //2
    end_corridor = (students[index][1]- 1) //2
    collapse = False

    for i in range(start_corridor, end_corridor+1):
        if corridor[i] == True :
            collapse = True
            break
    if collapse == False:
        for i in range(start_corridor, end_corridor+1):            
            corridor[i] = True
        visit[index] = True

    for i,v in enumerate(visit):
        if v == False :
            dfs(students, visit, corridor, i, time +1)

    visit[index] = False
    for i,v in enumerate(visit):
        if v == False :
            dfs(students, visit, corridor, i, time +1)


tc = int(input())
for tc in range(1, tc+1):
    n = int(input())
    corridor = [False] * 220
    students = []
    for _ in range(n):
        start, end = map(int, input().split())
        students.append([start, end])

    visit = [False] * len(students)

    for i in range(len(students)):
        dfs(students, visit, corridor, i, 0)
    
    print('#{} {}'.format(tc, answer))
    answer = 987654321


'''
3  
4  
10 20 
30 40
50 60
70 80
2 
1 3
2 200
3
10 100
20 80
30 50
'''