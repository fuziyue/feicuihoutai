<?php
header('content-type:text/html;charset=utf-8');
$username = $_POST['user'];

$users = array('梁慧','张彬','少天阔');

if( in_array( $username , $users ) ){
	echo '用户名已经被注册了！';

}else{
	echo '可以注册';
}

?>