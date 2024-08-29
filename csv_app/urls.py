from django.urls import path
from . import views
urlpatterns = [
    
    path('',views.get_file.asdf,name='file_input'),
    path('show/',views.get_file.f_show, name='files' ),
    path('data/',views.get_file.d_show, name='f_data'),
   
]