/** 
* -------------------------------------------------------
* -------------------------------------------------------
* -- Get all tables function
* --
* -- @returns setof {JSON} - rows of JSON object
*/ 
CREATE OR REPLACE FUNCTION public.table_all_json()
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
	
declare
	v_t         text;
	v_jsonb	  	jsonb;
	v_col_name	jsonb;
	v_tmp		    jsonb;
	v_res		    jsonb;
begin

	-- for all tables in db
	for v_t in 
		-- get all tables from public
		SELECT table_name::text
	  	  FROM information_schema.tables
	 	 WHERE table_schema = 'public'
	   	   AND table_type = 'BASE TABLE'
	loop
		-- create first level JSONB
		select jsonb_build_object('table', v_t)
	  	  into v_jsonb;

		-- get all columns in table
		with t(n) as (
			SELECT column_name::text
			  FROM information_schema.columns
			 WHERE table_schema = 'public'
			   AND table_name   = v_t
		  )
		select array_to_json(array_agg(n))
		into v_col_name
		from t;	
		
		select jsonb_build_object('columns', v_col_name)
		  into v_tmp;
	
		-- join JSONB variables
		v_jsonb := v_jsonb || v_tmp;

		-- prepare JSON data
		execute		
			$sql$ 
				select 
					jsonb_build_object(

						'rows',
						json_agg(
							translate(
								string_to_array(
									replace(t::text, '"', ''), 
									','
								)::text, 
								'()', 
								''
							)::text[]
						) 
					)
				from $sql$ || v_t || $sql$ AS t $sql$
		
		into v_tmp;
	
		-- join JSONB variables
		v_jsonb := v_jsonb || v_tmp;
		return next v_jsonb;
	end loop;

	return;
end; $function$;
/* 
* -- END
* -------------------------------------------------------
* -------------------------------------------------------
*/

/** 
* -------------------------------------------------------
* -------------------------------------------------------
* -- INSERT row function
* --
* -- @param {JSON} - row to be inserted in JSON format
*/ 
CREATE OR REPLACE FUNCTION public.insert_row_json(_j json)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
	_res int;				-- hold new row id
	_data json;				-- row in json format
	_sql varchar;			-- value to insert
begin

	_data := _j->'data';
	with 
		t1(key) as (
			select *
			from	
				json_object_keys(_data)
			where json_object_keys != 'id'
		),

		t2(key_value) as (
			select '''' || (_data->>key) || '''' from t1
		)
	select 
		array_to_string(array_agg(key_value), ', ')
	into 
		_sql
	from 
		t2;		
	EXECUTE 
		'INSERT INTO ' || CAST(_j->'table' as varchar) || 
		' VALUES(default, ' || _sql  || ') RETURNING id'
	into 
		_res;
	return
		_res;
END $function$;
/* 
* -- END
* -------------------------------------------------------
* -------------------------------------------------------
*/

/** 
* -------------------------------------------------------
* -------------------------------------------------------
* -- UPDATE row function
* --
* -- @param {JSON} - row to be updated in JSON format
*/ 
REATE OR REPLACE FUNCTION public.update_row_json(_j json)
 RETURNS SETOF void
 LANGUAGE plpgsql
AS $function$
declare
	_sql varchar;
	_data json;
	--_res int;
begin
	_data := _j->'data';
	with 
		t1(key) as (
			select *
			from	
				json_object_keys(_data)
			where json_object_keys != 'id'
		),
		t2(key_value) as (
			select '"' || key || '" = ''' || (_data->>key) || '''' from t1
		)
	select 
		array_to_string(array_agg(key_value), ', ')
	into 
		_sql

	from 
		t2;		
	EXECUTE
		'UPDATE ' || CAST(_j->'table' as varchar) || 
		' SET ' || _sql || 
		' WHERE id = ' || '''' || CAST(_data->>'id' as varchar) || '''';	
	--GET DIAGNOSTICS _res = ROW_COUNT;	
	return;
END $function$;
/* 
* -- END
* -------------------------------------------------------
* -------------------------------------------------------
*/

/** 
* -------------------------------------------------------
* -------------------------------------------------------
* -- DELETE row function
* --
* -- @param {JSON} - row (id) to be deleted in JSON format
*/ 
CREATE OR REPLACE FUNCTION public.delete_row_json(_j json)
 RETURNS SETOF void
 LANGUAGE plpgsql
AS $function$
declare
	_data json;
begin
	_data := _j->'data';
	EXECUTE
		'DELETE FROM ' || CAST(_j->'table' as varchar) || 
		--' SET ' || _sql || 
		' WHERE id = ' || '''' || CAST(_data->>'id' as varchar) || '''';	
	return;
END $function$;
/* 
* -- END
* -------------------------------------------------------
* -------------------------------------------------------
*/

/** 
* ---------------------------------------------------
* ---------------------------------------------------
* -- VIEW all products
* --
*/ 
CREATE OR REPLACE VIEW public.prikaz_proizvoda
AS SELECT proizvod.grozde_id AS id,
    proizvod.naziv,
    grozde.naziv AS vrsta,
    boja.naziv AS boja
   FROM proizvod proizvod,
	 
    grozde grozde,
    boja boja
  WHERE proizvod.grozde_id = grozde.id AND grozde.boja_id = boja.id;
/* 
* -- END
* ---------------------------------------------------
* ---------------------------------------------------
*/