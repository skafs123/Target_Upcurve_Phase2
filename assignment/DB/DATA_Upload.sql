
INSERT INTO threshold(metric_id,metric_name,critical_maxval, critical_minval,need_attn_maxval,need_attn_minval)
VALUES
('1','systolic Blood Pressure','180','80','140','60'),
('2','diastolic Blood Pressure','100','40','90','60'),
('3','Heart Rate','140','40','120','60'),
('4','Fasting Blood Sugar','200','60', '126','80');


INSERT INTO departments(department_id ,department_name,department_desc )
VALUES
('1', 'General', 'Internal Medicine' ),
('2', 'general surgery', 'General Suregery' ),
('3', 'endocrinology', 'Related to endocrine system' );

INSERT INTO user(user_id,password, name	, email	 ,phone,role,otp)
VALUES
('1' ,'ramanath','ramanath','rama@ghosp.com','9488729034','1' ,'123456'),
('2' ,'somanath','somanath','soman@ghosp.com','9488729022','2','123456' ),
('3' ,'krishna','krishna','krishna@ghosp.com','9488729224','2','123456' ),
('4' ,'sumana','sumana','sumana@gmail.com','9488723134','3' ,'123456'),
('5' ,'vikas','vikas','vikas@gmail.com','9488725689','3' ,'123456');

INSERT INTO doctor(doctor_id, department_id)
VALUES
(2,1),
(3,2);

INSERT INTO patient(patient_id,doctor_id)
VALUES
(4,2),
(5,3);



















