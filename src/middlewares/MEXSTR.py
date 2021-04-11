for _ in range(int(input())):
    s = input()
    #  find out the index of last zero and count how many 1 before it
    count = 0
    ans = []
    flag=0
    for i in range(len(s)-1, 0, -1):
        if s[i]!=s[i-1] and flag==0:
            flag=1
            print(s[i], ' ', s[i-1])
        if flag==1:
            if s[i]=='0':       
                ans.insert(0, '1')
            else:
                ans.insert(0, '0')
    
    for i in ans:
        if i=='1':
            break

    print(ans)
