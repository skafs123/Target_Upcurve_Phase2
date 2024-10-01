drop database  HMSDB;
create database HMSDB;
use HMSDB;


create table departments(
    department_id  int ,
    department_name  varchar(50),
    department_desc  varchar(50),
    constraint pk_departments  primary key (department_id )
);

/* user role - 1 - admin . 2 - doctor , 3 - patient */

create table user(
   user_id	 int	,
   name	 varchar(50),	
   email	 varchar(100),	
   phone	 varchar(50),	
   password  varchar(100),
   role  int,
   otp int,
   constraint pk_user   primary key (user_id)
   
);

create table doctor(
   doctor_id 	int	,
   department_id  int ,
   constraint pk_doctor   primary key (doctor_id),
   constraint fkd_doctor   FOREIGN KEY (department_id ) REFERENCES departments(department_id  ),
   constraint fku_doctor   FOREIGN KEY (doctor_id ) REFERENCES  user(user_id  )
    
);
create table patient(
   patient_id	int	,
   doctor_id	int	,
   constraint pk_patient  primary key (patient_id),
   constraint fkp_patient  FOREIGN KEY (patient_id ) REFERENCES user(user_id  ),
   constraint fkd_patient  FOREIGN KEY (doctor_id ) REFERENCES doctor(doctor_id  )
    
);


create table threshold(
   metric_id	int	,
   metric_name	varchar(50),	
   critical_maxval int	,
   critical_minval int,
   need_attn_maxval int,
   need_attn_minval int,
   constraint pk_threshold  primary key (metric_id)
    
);

create table healthmetrics(
   patient_id	int	,
   metric_type	varchar(10),
   timestamp	 date,			
   metric_val1 int,
   metric_val2 int,
   
   constraint pk_healthmetrics  primary key (patient_id,metric_type,timestamp),
   constraint fkp_healthmetrics  FOREIGN KEY (patient_id ) REFERENCES patient(patient_id  )
);

/* severity 1 - Critical   2 - Need attention */
create table alerts(
    alert_id int,
    patient_id	int	,
    doctor_id	int	,
    timestamp	 date,	
    severity int,
    metric_type	varchar(10),
    constraint pka_alerts  primary key (alert_id),
    constraint fkp_alerts  FOREIGN KEY (patient_id ) REFERENCES patient(patient_id  ),
    constraint fkd_alerts  FOREIGN KEY (doctor_id ) REFERENCES doctor(doctor_id  )

);














