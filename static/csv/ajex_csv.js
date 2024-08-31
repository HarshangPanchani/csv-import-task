const btn_submit = document.getElementById('btn_csv_submit');
 btn_submit.addEventListener('click',submit_btn);
 function submit_btn()
 {
    alert("file inserted");
 }

 $(document).ready(function(){
   $('#form_show').on('submit',function(event) {
      event.preventDefault();
      $.ajax({
         url: $(this).attr('action'),
         type : 'post',
         data : $(this).serialize(),
         success : function(response){
            
            let row_d = response.rows;
            $('#div_tag').empty();
            $('#div_tag').append(`
            
            
            <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>file name</th>
                    <th>date&time created</th>
                    <th> </th>
                </tr>
            </thead>
            <tbody id = "tbody"> 
            </tbody>
            </table>`);
            
            $.each(row_d, function(index,row){
               console.log(row.id);
               $('#tbody').append(
                  '<tr>'+
                     '<td>'+row.id+'</td>'+
                     '<td>'+row.file_name+'</td>'+
                     '<td>'+row.f_datetime+'</td>'+
                     '<td>    <form id="form_'+row.file_name.replace(".","_") +'" action="'+dataurl+'" method="post">'+
                              '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
                              '<input type="hidden" name="fname" value="'+row.file_name+'">'+
                              '<button type="submit" name="btn_show" value="'+row.file_name+'" >show files</button>'+
                              '</form>'+ 

                     '</td>'+
                     
                  '</tr>'+
                  '<tr> <td colspan= "4" ><div id ="dataModal_'+row.file_name.replace(".","_") +'" class="dataModal" style="display : none;"><div id="modalContent_'+row.file_name.replace(".","_") +' class="modalContent" "><span id="closeModal_'+row.file_name.replace(".","_") +'" class="closeModal" onclick="closeModal(\''+row.file_name.replace(".","_") +'\')">X</span><div id="modalDataContainer_'+row.file_name.replace(".","_") +'" class="modalDataContainer">'+
                  '<table>'+
                  '<thead><tr id= "h_'+row.file_name.replace(".","_")+'">'+
                  '</tr></thead>'+
                  '<tbody id= "b_'+row.file_name.replace(".","_")+'"><div></div>'+
                  '</tbody>'+
                  '</table></div></div>'+
                  '<div id="updiv_'+row.file_name.replace(".","_")+'" style="align-items : center; justify-content : center; padding: 100px; border-radius: 5px;"><form id="update_'+row.file_name.replace(".","_") +'" method="post" action="'+updateurl+'" ></form>hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii</div><div id="err"></div></div>'+
                  '</td></tr>'
               );
               var form_ins_id ="form_insert_"+ row.file_name.replace(".","_");
               $('#form_'+row.file_name.replace(".","_")).on('submit', function(event){
                  event.preventDefault();
                  $.ajax({
                     url: $(this).attr('action'),
                     type : 'post',
                     data : $(this).serialize(),
                     success : function(response){
                        
                        document.getElementById('dataModal_'+row.file_name.replace(".","_")).style.display = 'flex';
                        show_data(response, row);
                     },
                     error : function(xhr,status, error){
                        $('#b_'+row.file_name.replace(".","_")).html("any error occured :"+ error);
                     }
                  });
               });
               
               $(document).on('submit','#'+form_ins_id, function(event){
               // $('#'+form_ins_id).on('submit', function(event){
                  // alert("form_insert_"+row.file_name.replace(",","_"))
                  event.preventDefault();
                  $.ajax({
                     url: $(this).attr('action'),
                     type : 'post',
                     data : $(this).serialize(),
                     success : function(response){
                        document.getElementById('dataModal_'+row.file_name.replace(".","_")).style.display = 'flex';
                        h=document.getElementById('h_'+row.file_name.replace(".","_"));
                        h.innerHTML='';
                        h.textContent='';
                        b=document.getElementById('b_'+row.file_name.replace(".","_"));
                        b.innerHTML='';
                        b.textContent='';
                        
                        show_data(response,row);
                        
                     },
                     error : function(xhr,status,error){
                        $('#b_'+row.file_name.replace(".","_")).html("any error occured :"+error);
                     }
                  });
                  
               });
               $(document).on('submit','#update_'+row.file_name.replace(".","_"),function(event){
                  alert("in the update button");
                  event.preventDefault();
                  $.ajax({
                     url : $(this).attr('action'),
                     type : 'post',
                     data : $(this).serialize(),
                     success : function(response){
                        document.getElementById('dataModal_'+row.file_name.replace(".","_")).style.display = 'flex';
                        h=document.getElementById('h_'+row.file_name.replace(".","_"));
                        h.innerHTML='';
                        h.textContent='';
                        b=document.getElementById('b_'+row.file_name.replace(".","_"));
                        b.innerHTML='';
                        b.textContent='';
                        d=document.getElementById('update_'+row.file_name.replace(".","_"),);
                        d.innerHTML='';
                        d.textContent='';
                        show_data(response,row);
                     },
                     error : function(xhr,status,error){
                        $('#err').html("any error occured :"+error);
                     }
                  });
               });
            });
           
            
         },
         error : function(xhr,status, error){
            $('#div_tag').html("any error occured :"+ error);
         }
      });


      
               
               
      
   });
 });
function closeModal(data_file){
   var d1= document.getElementById('h_'+data_file)
   d1.innerHTML = '';
   d1.textContent= '';
   var d2= document.getElementById('b_'+data_file)
   d2.innerHTML = '';
   d2.textContent= '';
   
   console.log("data removed");
   var mydiv =document.getElementById('dataModal_'+data_file);
   mydiv.style.display = 'none' ;
   // location.reload();
}
// function show_data(row,response){
//    document.getElementById('dataModal_'+row.file_name.replace(".","_")).style.display = 'flex';
//                               $.each(response.data_col, function(index,column){
//                                  $('#h_'+row.file_name.replace(".","_")).append(
//                                     '<th>'+ column +'</th>'
//                                  );
                                 
//                               });
//                               $.each(response.data, function(index, data_row){
//                                  $('#b_'+row.file_name.replace(".","_")).append(
//                                     '<tr id= "br_'+data_row.id.replace("\'","") +'"></tr>'
//                                  );
//                                  $.each(data_row, function(index,r){
//                                     $('#br_'+data_row.id.replace("\'","")).append(
//                                        '<td align="center">'+ r +'</td>'

//                                     );
//                                     // console.log(r);
//                                  });
                                 
//                               });
//                               var col_span=response.data_col.length+1
//                               var form_ins_id ="form_insert_"+ row.file_name.replace(".","_")
//                               $('#b_'+row.file_name.replace(".","_")).append(
//                                  '<tr><td colspan="'+ col_span +'"><form id="'+ form_ins_id +'" action="'+inserturl+'" method="post"></form></td></tr>'
//                                  // '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
//                                  // '<input type="hidden" name="f_name" value="'+row.file_name+'">'
//                                  );
//                               $('#'+form_ins_id).append(
//                                  '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
//                                  '<input type="hidden" name="f_name" value="'+row.file_name+'">'
//                                  );
                              
//                               $.each(response.data_col,function(index,column){
//                                  $('#'+form_ins_id).append(
//                                  '<td><input type="text" name="'+column+'" placeholder="Enter '+ column +'"></td>'
//                                  );
//                               });
                              
//                               $('#'+form_ins_id).append(
                                    
//                                     '<td><button type="submit" name = "btn_insert_'+row.file_name.replace(".","_")+'">Insert</button></td>'
//                                     );

// }
function show_data(response,row){
   var form_ins_id ="form_insert_"+ row.file_name.replace(".","_");
                              $.each(response.data_col, function(index,column){
                                 $('#h_'+row.file_name.replace(".","_")).append(
                                    '<th>'+ column +'</th>'
                                 );
                                 
                              });
                              $.each(response.data, function(index, data_row){
                                 $('#b_'+row.file_name.replace(".","_")).append(
                                    '<tr id= "br_'+data_row.id.replace("\'","") +'"></tr>'
                                 );
                                 $.each(data_row, function(index,r){
                                    $('#br_'+data_row.id.replace("\'","")).append(
                                       '<td align="center">'+ r +'</td>'

                                    );
                                    // console.log(r);
                                 });
                                 $('#br_'+data_row.id.replace("\'","")).append(
                                    '<td align="center"><form id="upf_'+data_row.id.replace("\'","") +'" action="'+updatebtnurl+'" method="post">'+
                                    '</form></td>'

                                 );
                                 $('#upf_'+data_row.id.replace("\'","")).append(
                                    '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'
                                 );
                                 $.each(response.data_col, function(index,col){
                                    
                                    $('#upf_'+data_row.id.replace("\'","")).append(
                                       '<input type="hidden" name="'+col+'" value="'+data_row[col]+'">'
                                    );
                                    
                                 });
                                 $('#upf_'+data_row.id.replace("\'","")).append(
                                       '<button type="submit" id="btn_'+ data_row.id.replace("\'","") +'">Update</button>'
                                    );
                                 $(document).on('submit','#upf_'+data_row.id.replace("\'",""),function(event){
                                    
                                    event.preventDefault();
                                    $.ajax({
                                       url : $(this).attr('action'),
                                       type : 'post',
                                       data : $(this).serialize(),
                                       success : function(respons){
                                          $.each(response.data_col,function(index,column){
                                             console.log(data_row[column]);
                                             document.getElementById(''+column+'').value = data_row[column];

                                          });


                                       },
                                       error : function(xhr,status,error){
                                             $('#updiv_'+row.file_name.replace(".","_")).html("any error occured  :"+ error);
                                       }
                                    });

                                 });  
                                 
                              });
                              var col_span=response.data_col.length+1
                              
                              $('#b_'+row.file_name.replace(".","_")).append(
                                 '<tr><td colspan="'+ col_span +'"><form id="'+ form_ins_id +'" action="'+inserturl+'" method="post"></form></td></tr>'
                                 // '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
                                 // '<input type="hidden" name="f_name" value="'+row.file_name+'">'
                                 );
                                 
                              $('#'+form_ins_id).append(
                                 '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
                                 '<input type="hidden" name="f_name" value="'+row.file_name+'">'
                                 );
                              $('#update_'+row.file_name.replace(".","_")).append(
                                    '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'">'+
                                    '<input type ="hidden" name="tname" value="'+row.file_name.replace(".csv","")+'">'
                              );
                              $.each(response.data_col,function(index,column){
                                 $('#'+form_ins_id).append(
                                 '<td><input type="text" name="'+column+'" placeholder="Enter '+ column +'"></td>'
                                 );
                                 $('#update_'+row.file_name.replace(".","_")).append(
                                       '<input type="text" id="'+column+'" name="'+column+'" placeholder="Update '+column+'"><br>'
                                    );
                              });
                              
                              $('#'+form_ins_id).append(
                                    
                                    '<td><button type="submit" name = "btn_insert_'+row.file_name.replace(".","_")+'">Insert</button></td>'
                                 );
                              $('#update_'+row.file_name.replace(".","_")).append(
                                    '<button type="submit" id="btn_update_'+row.file_name.replace(".","_")+'">Update Data</button>'
                                 );
}
 

 