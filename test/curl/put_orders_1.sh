echo  "== PUT /orders/1 ==============="
curl -i -X PUT -H "Accepts: application/json" -H "Content-Type: application/json" -d '{"users":[{"id":6,"xkonto":"xanjoo","name":"Johan Andersson von Geijer","sigel":"G"}],"locations":[{"id":1,"label":"G","name_sv":"Humanistiska biblioteket","name_en":"Humanities Library"}],"statuses":[{"id":1,"name_sv":"Ny","name_en":"New"}],"order":{"id":1,"order_type":1,"title":"Artificial organs","publication_year":"2014","volume":"","issue":"3","pages":"111111","journal_title":"Journal of journals","issn_isbn":"1234-1234","reference_information":"","photocopies_if_loan_not_possible":false,"order_outside_scandinavia":true,"email_confirmation":true,"not_valid_after":"2014-05-20","delivery_type":2,"name":"Henry Jekyll","company1":"Astma och allergienheten","company2":"Östra Sjukhuset","company3":"","phone_number":"","email_address":"h.jekyll@example.com","library_card_number":"5001242102","customer_type":"sahl","comments":"","form_lang":"sv","authors":"","order_id":"20140520-151559.1","form_library":"G","delivery_place":"Skickas levadr","invoicing_name":"","invoicing_address":"","invoicing_postal_address1":"","invoicing_postal_address2":"","order_path":"SFX","created_at":"2014-06-13T12:13:18.624Z","updated_at":"2014-06-13T12:13:18.624Z","user_id":6,"location_id":1,"status_id":1}}' http://localhost:3000/orders/1
#curl -i -X PUT -H "Accepts: application/json" -H "Content-Type: application/json" -d '{"order": {"id":1, "title":"Artificial organz", "status_id":2}}' http://localhost:3000/orders/1
echo ""
echo  "== GET /orders/1 ==============="
curl -i -X GET -H "Accepts: application/json" http://localhost:3000/orders/1
echo ""
