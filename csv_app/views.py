from django.shortcuts import redirect, render
from django.http import HttpRequest, HttpResponse , JsonResponse
from django.views.generic.edit import FormView
from django.views import View
from .forms import UploadFileForm
from django.urls import reverse_lazy
from django.db import connection
import csv
import logging
import re
from django.template.loader import render_to_string
logging.basicConfig(level=logging.DEBUG)
logger =logging.getLogger()
class get_file(View):
    #template_name='csv_app/upload_csv.html'
    
    def dispatch(self, request: HttpRequest, *args: reverse_lazy, **kwargs: reverse_lazy) -> HttpResponse:
        
        return super().dispatch(request, *args, **kwargs)
    def asdf(request):
        
        if request.method == 'POST':
            logger.debug('post')
            button_clicked = request.POST.get('btn_csv')
            if button_clicked == 'submit':
                f= request.FILES.get('file_x')
                if f:
                    logger.debug(str(f))
                    fname=f.name
                    n,t=fname.split(".")
                    t_name=n.replace(" ","_")
                    csv_reader= csv.reader(f.read().decode('utf-8').splitlines())
                    headers= next(csv_reader)
                    
                    
                    logger.debug("execution started")
                    logger.info("execution started")
                    get_file.createtable(fname,t_name,headers)
                    get_file.inserttable(t_name,headers,csv_reader)
        return render(request,'csv_app/upload_csv.html')
            # if button_clicked == 'show':
            #     logger.debug("show_clicked")
            #     with connection.cursor() as cs:
            #         cs.execute("SELECT * FROM tbl_mng")
            #         rows=cs.fetchall()
                    
            # return render(request,'csv_app/upload_csv.html',{'rows':rows})
    def f_show(request):
        rows=""
        rows_dict=""
        logger.debug("show_clicked")
        button_c = request.POST.get('btn_csv')
        
        logger.debug(button_c)
        
        with connection.cursor() as cs:
                cs.execute("SELECT * FROM tbl_mng order by id")
                rows=cs.fetchall()
                rows_dict =[ {'id': row[0],'file_name':row[1],'f_datetime': row[2]} for row in rows]    
                for row in rows:    
                    logger.debug(str(row[2]))
                
                #html_d= render_to_string('csv_app/upload_csv.html',{'rows':rows_dict}) 
        return JsonResponse({'rows':rows_dict})
        #return JsonResponse({'error': 'invalid request'}, status=400)
        # return render(request,'csv_app/upload_csv.html',{'rows':rows_dict})
    def d_show(request):
        btnclicked = request.POST.get('fname')
        logger.debug("hiii")
        logger.debug(request.POST)
        logger.debug(btnclicked)
        tname= btnclicked.replace(".csv","")
        with connection.cursor() as cs:
            cs.execute(f"SELECT * FROM {tname}")
            data_rows_temp =cs.fetchall()
            col_name =[  col[0] for col in cs.description]
            cs.execute(f"SELECT * FROM {tname} ORDER BY {col_name[0]}")
            data_rows=cs.fetchall()
            logger.debug(len(col_name))
            
        data_dict = [dict(zip(col_name,rows)) for rows in data_rows]
            
            
        
        logger.debug(data_dict)

        
        return JsonResponse({"data_col": col_name,"data": data_dict})



    def get(self,request,*args,**kwargs):
        return render(request,'csv_app/upload_csv.html')

    # def post(self,request,*args,**kwargs):

    #     button_clicked = request.POST.get('btn_csv')
    #     if button_clicked == 'submit':
    #         f= request.FILES.get('file_x')
    #         if f:
    #             logger.debug(str(f))
    #             fname=f.name
    #             n,t=fname.split(".")
    #             t_name=n.replace(" ","_")
    #             csv_reader= csv.reader(f.read().decode('utf-8').splitlines())
    #             headers= next(csv_reader)
                
                
    #             logger.debug("execution started")
    #             logger.info("execution started")
    #             self.createtable(fname,t_name,headers)
    #             self.inserttable(t_name,headers,csv_reader)
    #         return render(request,'csv_app/upload_csv.html')
    #     if button_clicked == 'show':
    #         logger.debug("show_clicked")
    #         with connection.cursor() as cs:
    #             cs.execute("SELECT * FROM tbl_mng")
    #             rows=cs.fetchall()
                
    #             return render(request,'csv_app/upload_csv.html',{'rows':rows})

            

        
    def createtable(fname,t_name,headers):
        if re.search(";",headers[0]):
            logger.debug(headers[0])
            hea= headers[0].replace(";",",")
            
            logger.debug(hea)
            hea= hea.replace("\"","")
            hea= hea.replace("\'","")
            # columns = ",".join(part.replace("\'","") for part in hea.split(","))
            # columns = ",".join(part.replace("\"","") for part in hea.split(","))
            logger.debug(hea)
            columns=",".join([f" {part} VARCHAR(255)"  for part in hea.split(",")]) 
            logger.debug(columns)
        else:
            logger.debug("NIKKALLODIAN")
            colu =",".join([f"{header} VARCHAR(255) " for header in headers])
            logger.debug(colu)
            columns = ",".join([part.replace("'","") for part in colu.split(",")])
            # not needed  columns = ",".join([part.replace("\"","") for part in colu.split(",")])
            logger.debug(columns)
            # col =",".join([item.replace("'","") for item in colu.split(",")])
            # # logger.debug(headers)
            # logger.debug(col)
        with connection.cursor() as c:
                logger.debug("checks")
                c.execute(f"""SELECT EXISTS( SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename= '{t_name}')""")
                table_exists = c.fetchone()[0]
                logger.debug(t_name +"////"+str(table_exists))
                if table_exists:
                    logger.error("table already exists")
                else:
                    tbl_mng = "tbl_mng"
                    c.execute(f"""SELECT EXISTS( SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename= '{tbl_mng}')""")
                    tbl_mng_exists= c.fetchone()[0]
                    logger.debug(tbl_mng+"///" + str(tbl_mng_exists))
                    if tbl_mng_exists:
                        logger.debug(tbl_mng+"///" + str(tbl_mng_exists))
                    else:
                        c.execute(f'''
                        CREATE TABLE {tbl_mng}(
                        id SERIAL PRIMARY KEY,
                        file_name VARCHAR(100),
                        f_datetime TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

                        );
                        ''')
                        logger.debug(tbl_mng+"  created")
                    logger.debug(fname)
                    c.execute(f'''INSERT INTO {tbl_mng}(file_name)
                                    VALUES
                                    ('{fname}'); ''')
                    logger.debug(tbl_mng+"  inserted")
                    c.execute(f"SELECT id FROM {tbl_mng} WHERE file_name='{fname}'")
                    f_id= c.fetchone()[0]
                    logger.debug(str(f_id)+" ______")
                    c.execute(f"""SELECT EXISTS( SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename= '{t_name}')""")
                    t_exists = c.fetchone()[0]
                    if t_exists:
                        logger.debug(f"{t_name}   already exists ")
                    else:
                        c.execute(f'''
                            CREATE TABLE {t_name}(
                            {columns},
                            f_id INT  DEFAULT {f_id}
                            );
                            ''')
                        logger.debug(t_name+"    created")
                        
    
    def inserttable(t_name,headers,csv_reader):
            values=""
            asdf=""
            if re.search(";",headers[0]):
                logger.debug(headers[0])
                hea= headers[0].replace(";",",")
                
                logger.debug(hea)
                hea= hea.replace("\"","")
                hea= hea.replace("\'","")
                # columns = ",".join(part.replace("\'","") for part in hea.split(","))
                # columns = ",".join(part.replace("\"","") for part in hea.split(","))
                logger.debug(hea)
                columns=",".join([f" {part} "  for part in hea.split(",")]) 
                logger.debug(columns)
                values= ",".join([f"%s" for header in hea.split(",")])
                logger.debug(values)
                with connection.cursor() as c:
                    for row in csv_reader:
                        logger.debug(row[0])
                        hea= row[0].replace(";",",")
                        
                        logger.debug(hea)
                        hea= hea.replace("\"","")
                        hea= hea.replace("\'","")
                        # columns = ",".join(part.replace("\'","") for part in hea.split(","))
                        # columns = ",".join(part.replace("\"","") for part in hea.split(","))
                        logger.debug(hea)
                        asdf=",".join([f"'{part}'"  for part in hea.split(",")]) 
                        
                        logger.debug(asdf)
                        logger.debug(f"INSERT INTO {t_name}({columns}) VALUES ({asdf});")
                        
                        c.execute(f"INSERT INTO {t_name}({columns}) VALUES ({asdf});")
            else:
                logger.debug("NIKKALLODIAN")
                colu =",".join([f"{header} VARCHAR(255) " for header in headers])
                logger.debug(colu)
                columns = ",".join([part.replace("'","") for part in colu.split(",")])
                # not needed  columns = ",".join([part.replace("\"","") for part in colu.split(",")])
                logger.debug(columns)
                values= ",".join([f"%s" for header in colu.split(",")])
                logger.debug(values)
                
                with connection.cursor() as c:
                    for row in csv_reader:
                        logger.debug(row)

                        c.execute(f'''
                        INSERT INTO {t_name}
                        VALUES 
                        ({values}  );
                        ''', row)
            
            with connection.cursor() as cd:
                # cd.execute(f"SELECT * FROM {t_name}")
                # dat = cd.fetchall()
                # column_n= [cu[0] for cu in cd.description]
                # logger.debug("asdfghjhgfdfghjkjhgredfrghjkjhgfd")
                # logger.debug(column_n[0])
                # cd.execute(f"DELETE FROM {t_name} WHERE {column_n[0]} IN (SELECT {column_n[0]} FROM {t_name} GROUP BY {column_n[0]} HAVING COUNT(*) > 1 )")
                cd.execute(f"CREATE TEMP TABLE temp_tbl AS SELECT DISTINCT * FROM {t_name};")
                cd.execute(f"TRUNCATE TABLE {t_name};")
                cd.execute(f"INSERT INTO {t_name} SELECT * FROM temp_tbl; ")
                cd.execute("DROP TABLE temp_tbl;")
            
    
# not needed
    # def form_valid(self, form):
    #     file = form.cleaned_data['file_x']
    #     fname,lname=  file.name.split('.')
        
    #     return super().form_valid(form)




# def get_file(request):
#     if request.method == 'post' and request.FILES['file_x']:

#         file = request.FILES.get('file_x')
#         if file:
#             fname=file.name
#             print (fname)
#             return HttpResponse(f"<h1>{fname}</h1>")
#     else:
#         return render(request,'csv_app/upload_csv.html')

# def success(request):
#     return HttpResponse('success')
    

    

# Create your views here.

