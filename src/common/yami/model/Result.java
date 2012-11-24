package yami.model;

public class Result
{
	public String link;
	public String output;
	private int exit;

	public Result(int exit, String output)
	{
		this.exit = exit;
		this.output = output;
	}

	public boolean success()
	{
		return exit == 0;
	}

	@Override
	public String toString()
	{
		return "Result [link=" + link + ", output=" + output + ", exit=" + exit + "]";
	}
	
	
}