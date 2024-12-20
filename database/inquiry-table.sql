CREATE TABLE IF NOT EXISTS public.inquiry 
(
	inquiry_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	inv_id integer NOT NULL,
	inquiry_firstname character varying NOT NULL,
	inquiry_lastname character varying NOT NULL,
	inquiry_phone character varying NOT NULL,
	inquiry_email character varying NOT NULL,
	inquiry_message text NOT NULL,
	CONSTRAINT inquiry_pk PRIMARY KEY (inquiry_id),
	CONSTRAINT inquiry_inv_fk FOREIGN KEY (inv_id) REFERENCES inventory(inv_id)
)