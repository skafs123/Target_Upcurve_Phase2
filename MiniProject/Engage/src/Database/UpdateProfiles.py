import mysql.connector

def update_user_profile_picture(user_id, profile_picture_path):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="Engage"
    )
    cursor = conn.cursor()

    with open(profile_picture_path, 'rb') as file:
        binary_data = file.read()

    sql = """
    UPDATE Users
    SET ProfilePicture = %s
    WHERE UserID = %s
    """
    cursor.execute(sql, (binary_data, user_id))
    conn.commit()
    cursor.close()
    conn.close()


if "__name__" == "__main__":
    update_user_profile_picture(1, "")
    update_user_profile_picture(2, "")
    update_user_profile_picture(3, "")
    update_user_profile_picture(4, "")
    update_user_profile_picture(5, "")
    update_user_profile_picture(6, "")
    update_user_profile_picture(7, "")
    update_user_profile_picture(8, "")
    update_user_profile_picture(9, "")
    update_user_profile_picture(10, "")
    update_user_profile_picture(11, "")