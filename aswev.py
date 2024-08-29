s=['"id"','"name"']
print(s)
a=[]
for s1 in s:
    a.append(s1.strip('"'))
s=a   
print(s)