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
            </table> `);
            
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
                  '<tbody id= "b_'+row.file_name.replace(".","_")+'">'+
                  '</tbody>'+
                  '</table></div></div></div>'+
                  '</td></tr>'
               );
               $('#form_'+row.file_name.replace(".","_")).on('submit', function(event){
                  event.preventDefault();
                  $.ajax({
                     url: $(this).attr('action'),
                     type : 'post',
                     data : $(this).serialize(),
                     success : function(response){
                        
                        document.getElementById('dataModal_'+row.file_name.replace(".","_")).style.display = 'flex';
                           $.each(response.data_col, function(index,column){
                              $('#h_'+row.file_name.replace(".","_")).append(
                                 '<th>'+ column +'</th>'
                              );
                              
                           });
                           $.each(response.data, function(index, data_row){
                              $('#b_'+row.file_name.replace(".","_")).append(
                                 '<tr>'
                              );
                              $.each(data_row, function(index,r){
                                 $('#b_'+row.file_name.replace(".","_")).append(
                                    '<td>'+ r +'</td>'

                                 );
                                 console.log(r);
                              });
                              $('#b_'+row.file_name.replace(".","_")).append(
                                 '</tr>'
                              );
                           });
                           
                        


                     },
                     error : function(xhr,status, error){
                        $('#b_'+row.file_name.replace(".","_")).html("any error occured :"+ error)
                     }
                  });
               });
            });
           
            
         },
         error : function(xhr,status, error){
            $('#div_tag').html("any error occured :"+ error)
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

   
 

 