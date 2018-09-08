<?php
header('content-type:text/html;charset=utf-8');
//echo phpinfo();
$username = $_GET['user'];

$users = array('李乐','谢中俊','梁明卓');

sleep( 5 );

if( in_array( $username , $users ) ){
	echo '用户名已经被注册了！';
}else{
	echo '用户名可以注册';
}

?>